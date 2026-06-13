import React, { useEffect } from "react";
import PageTitle from "../home/PageTitle";
import {
  Link,
  Form,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth-context"; // 從 auth-context 中取得 useAuth hook

export default function Login() {
  const labelStyle =
    "block text-lg font-semibold text-brand dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();
  const { loginSuccess } = useAuth(); // 從 context 中取得 loginSuccess 函數

  // 從 sessionStorage 中獲取 skipRedirectPath 的值，這個值是用來決定是否跳過重定向的，如果是 "true" 就跳過，否則就正常重定向。
  const skipRedirectPath =
    sessionStorage.getItem("skipRedirectPath") === "true";

  // 從 sessionStorage 中獲取 redirectPath 的值，這個值是用來在登入成功後導航到用戶原本想去的頁面，如果沒有這個值，就默認導航到 "/home"。
  const from = skipRedirectPath
    ? "/home"
    : sessionStorage.getItem("redirectPath") || "/home";

  // 2. 處理登入成功或失敗的情況，根據 actionData 的內容來決定下一步的行動
  useEffect(() => {
    // 2.1 如果 actionData 中的 success 屬性為 true，表示登入成功；將 jwtToken 和 user 存入 context
    if (actionData?.success) {
      loginSuccess(actionData.jwtToken, actionData.user); // 呼叫 context 中的 loginSuccess 函數，將 jwtToken 和 user 存入 auth-context.jsx 中的 authState，這樣整個應用都能知道用戶已經登入了。

      // 2.2 根據 from 的值來決定導航的目標頁面，如果 from 是 "/checkout" 且地址不完整，則導航到 "/cart"，否則導航到 from 指定的頁面。
      const redirectTarget =
        from === "/checkout" && isAddressIncomplete(actionData.user)
          ? "/cart"
          : from; // 如果是從結帳頁面過來且地址不完整，則導向購物車頁面

      // 2.3 登入後清除 sessionStorage 中的 redirectPath 目的是避免下次登入時還帶有上次的路徑
      sessionStorage.removeItem("redirectPath");
      sessionStorage.removeItem("skipRedirectPath");

      // 2.4 延遲導航，確保 auth-context 先更新完成：jwtToken 和 user 存入 auth-context ( 確保 jwtToken & user 已經存入 localStorage ) 避免導航到 protected route 時出現 401 unauthorized
      setTimeout(() => {
        navigate(redirectTarget); // 登入成功後導航到原本要前往的頁面
      }, 100);
    } else if (actionData?.error) {
      // 2.5 如果 actionData 中的 success 屬性為 false，表示登入失敗；使用 react-toastify 顯示錯誤訊息
      toast.error(actionData.error.message || "登入失敗");
    }
  }, [actionData]); // 這個 useEffect 的依賴是 actionData，當 actionData 發生變化時會重新執行，這樣就能在登入成功或失敗後做出相應的處理。

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

          {/* Submit 按鈕 */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting} // 禁用按鈕，防止重複提交
              className="w-full px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
            >
              {isSubmitting ? "登入中..." : "Login"}
            </button>
          </div>
        </Form>

        {/* Register 連結*/}
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

// 1. 定義一個 loginAction 函數，這個函數會在 Login 組件的 Form 提交時被呼叫，負責處理登入邏輯
export async function loginAction({ request, params }) {
  // 1.1 從 request 中獲取表單數據，這些數據是使用者在登入表單中輸入的帳號和密碼
  const data = await request.formData();

  // 1.2 將表單數據轉換為後端所需的格式
  const loginPayload = {
    userName: data.get("username"),
    password: data.get("password"),
  };

  // 1.3 使用 apiClient 發送 POST 請求到後端的登入 API，並處理響應
  try {
    const response = await apiClient.post("/auth/login", loginPayload);

    const { message, user, jwtToken } = response.data; // 從響應中 response 提取數據
    return { success: true, message, user, jwtToken }; // 返回成功結果 給到 actionData
  } catch (error) {
    // 1.4 處理錯誤情況，401 Unauthorized 是最常見的錯誤，表示帳號或密碼錯誤
    if (error.response?.status === 401) {
      return {
        success: false,
        error: {
          message: error.response?.data?.message || "輸入的帳號或密碼錯誤", // data?.message 來自 LoginResponseDto 的 message 欄位
        },
      };
    }

    // 1.5 處理其他類型的錯誤，例如網絡錯誤或伺服器錯誤，這裡我們從 error 對象中提取錯誤訊息，並提供一個預設的錯誤訊息
    const backendMessage =
      error.response?.data?.errorMessage || // errorMessage 是後端回傳的錯誤訊息 (Global Exception Handler 回傳 dto 欄位)
      error.message || // error.message 是 axios 的錯誤訊息
      "登入失敗，請稍後再試"; // 預設錯誤訊息

    // 將錯誤訊息包裝成一個 Response 物件，並丟出這個錯誤，讓 useRouteError 在 ErrorPage.jsx 中捕獲並顯示錯誤訊息
    throw new Response(backendMessage, {
      status: error.response?.status || 500,
    });
  }
}
