import React, { useEffect } from "react";
import PageTitle from "../home/PageTitle";
import {
  Link,
  Form,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router-dom";

import apiClient from "../../api/apiClient"; // 這是 axios 的封裝
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth-context"; // 從 store 中引入 useAuth hook

export default function Login() {
  const labelStyle =
    "block text-lg font-semibold text-brand dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  const actionData = useActionData(); // 獲取表單提交後的數據 (from loginAction function)
  const navigation = useNavigation(); // 獲取表單提交的狀態
  const isSubmitting = navigation.state === "submitting"; // 獲取表單提交的狀態
  const navigate = useNavigate(); // 獲取導航函數
  const { loginSuccess } = useAuth(); // 從 context 中取得 loginSuccess 函數

  const skipRedirectPath =
    sessionStorage.getItem("skipRedirectPath") === "true";

  // 獲取 sessionStorage 中的 redirectPath，如果沒有則預設為 "/home"
  const from = skipRedirectPath
    ? "/home"
    : sessionStorage.getItem("redirectPath") || "/home";

  // 處理登入成功後的導航
  useEffect(() => {
    if (actionData?.success) {
      loginSuccess(actionData.jwtToken, actionData.user); // 將 jwtToken 和 user 存入 context

      const redirectTarget =
        from === "/checkout" && isAddressIncomplete(actionData.user)
          ? "/cart"
          : from; // 如果是從結帳頁面過來且地址不完整，則導向購物車頁面

      // 清除 sessionStorage 中的 redirectPath 目的是避免下次登入時還帶有上次的路徑
      sessionStorage.removeItem("redirectPath");
      sessionStorage.removeItem("skipRedirectPath");

      // 延遲導航，確保 context 更新完成：jwtToken 和 user 存入 auth-context 避免 401 unauthorized
      setTimeout(() => {
        navigate(redirectTarget); // 登入成功後導航到原本要前往的頁面
      }, 100);
    } else if (actionData?.error) {
      toast.error(actionData.error.message || "登入失敗");
    }
  }, [actionData]);

  return (
    <div className="min-h-213 flex items-center justify-center font-brand dark:bg-darkbg">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6">
        <PageTitle title="登入" />
        {/* 表單 */}
        <Form method="post" className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="username" className={labelStyle}>
              Email
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Your Email"
              required
              className={textFieldStyle}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className={labelStyle}>
              密碼
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Your Password"
              autoComplete="username" // autoComplete="username" 會讓瀏覽器彈出一個下拉選單，讓使用者直接挑選要用哪個帳號登入，而不需要手動輸入長長的 Email。
              required
              minLength={4}
              maxLength={20}
              className={textFieldStyle}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting} // 禁用按鈕，防止重複提交
              className="w-full px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
            >
              {isSubmitting ? "登入中..." : "Login"}
              {/* 按鈕顯示：登入資料驗證中... 或 登入 */}
            </button>
          </div>
        </Form>

        {/* Register Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          還沒有帳號嗎？{" "}
          <Link
            to="/register"
            className="text-brand dark:text-light hover:text-dark dark:hover:text-brand transition duration-200"
          >
            這裡註冊
          </Link>
        </p>
      </div>
    </div>
  );
}

function isAddressIncomplete(user) {
  const address = user?.address;

  if (!address) {
    return true; // 沒有地址，返回 true
  }

  const { street, city, state, postalCode, country } = address;
  return !street || !city || !state || !postalCode || !country; // 地址不完整，返回 true
}

// 從 Login 組件中匯入 loginAction 函式；這個函式是用來在表單提交時處理表單數據的，會在 Login 組件中使用 useActionData hook 來獲取這些數據。
export async function loginAction({ request, params }) {
  const data = await request.formData(); // 從 request 中提取表單數據

  // 將表單數據轉換為後端所需的格式
  const loginPayload = {
    userName: data.get("username"),
    password: data.get("password"),
  };

  try {
    // 發送 POST 請求到 "/auth/login" 端點，將 loginPayload 作為請求體
    const response = await apiClient.post("/auth/login", loginPayload);

    // response.data 的 data 是 後端 API 回傳的 response body，再由 Axios 包裝在 response.data 裡面。
    const { message, user, jwtToken } = response.data; // 從響應中 response 提取數據
    return { success: true, message, user, jwtToken }; // 返回成功結果 給到 actionData
  } catch (error) {
    if (error.response?.status === 401) {
      return {
        success: false,
        error: {
          message: error.response?.data?.message || "輸入的帳號或密碼錯誤", // data?.message 來自 buildErrorResponse.message
        }, // 401 狀態碼表示驗證失敗，返回錯誤信息
      };
    }

    const backendMessage =
      error.response?.data?.errorMessage || // errorMessage 是後端回傳的錯誤訊息 (Global Exception Handler 回傳 dto 欄位)
      error.message || // error.message 是 axios 的錯誤訊息
      "登入失敗，請稍後再試"; // 預設錯誤訊息

    // 將錯誤訊息包裝成 Response 物件，並設定狀態碼用於顯示於 ErrorPage 元件 (throw new Response()->ErrorPage)
    throw new Response(backendMessage, {
      status: error.response?.status || 500,
    });
  }
}
