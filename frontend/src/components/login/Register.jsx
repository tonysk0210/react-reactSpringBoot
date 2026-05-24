import React, { useRef, useEffect } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import PageTitle from "../home/PageTitle";

export default function Register() {
  const actionData = useActionData(); // 這是用來獲取後端返回的數據
  const navigation = useNavigation();
  const navigate = useNavigate();
  const formRef = useRef(null); // 這是用來獲取表單元素的 ref
  const submit = useSubmit(); // 這是用來提交表單的函數

  const isSubmitting = navigation.state === "submitting"; // 這是用來判斷是否正在提交

  // 監聽 actionData，當註冊成功時，導航到登入頁面
  useEffect(() => {
    if (actionData?.success) {
      navigate("/login");
      toast.success("註冊成功，請登入");
    }
  }, [actionData]);

  // 處理表單提交
  const handleSubmit = (event) => {
    event.preventDefault(); // 阻止瀏覽器用原生方式提交表單，避免整個頁面刷新
    const formData = new FormData(formRef.current); // 獲取表單數據；　formRef.current　是目前被 ref 指到的實際 form DOM 元素；　React render 完、表單真的出現在 DOM 上之後，React 會把那個實際的 <form> DOM node 放進：formRef.current
    if (!validatePasswords(formData)) {
      // 驗證密碼是否匹配
      return; // 如果密碼不匹配，則不提交表單
    }
    submit(formData, { method: "post" }); // 提交表單
    // 這會通知 React Router：然後 React Router 會把 navigation.state 改成 submitting (改變會觸發 re-render)
    // 常見 navigation.state 有三種：
    // - idle: 未提交
    // - submitting: 正在提交
    // - loading: 頁面 / loader 正在載入
  };

  // 驗證密碼是否匹配函數
  const validatePasswords = (formData) => {
    const password = formData.get("password");
    const confirmPwd = formData.get("confirmPwd");

    if (password !== confirmPwd) {
      toast.error("密碼不一致!");
      return false;
    }
    return true;
  };

  // Tailwind CSS classes
  const labelStyle =
    "block text-lg font-semibold text-brand dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  return (
    <div className="min-h-[752px] flex items-center justify-center font-brand dark:bg-darkbg">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6">
        <PageTitle title="註冊" />
        {/* 表單 */}
        <Form
          method="POST"
          ref={formRef} // 這是用來獲取表單元素的 ref
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className={labelStyle}>
              姓名
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              required
              minLength={2}
              maxLength={30}
              className={textFieldStyle}
            />
            {/* 如果 actionData?.error?.name 存在(List<String>)，則顯示錯誤訊息 */}
            {actionData?.error?.name && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.name.join(", ")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                autoComplete="email"
                required
                className={textFieldStyle}
              />
              {/* 如果 actionData?.error?.email 存在(List<String>)，則顯示錯誤訊息 */}
              {actionData?.error?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.error.email.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="mobileNumber" className={labelStyle}>
                手機號碼
              </label>
              <input
                id="mobileNumber"
                type="tel"
                name="mobileNumber"
                placeholder="Your Mobile Number"
                required
                pattern="^\d{10}$"
                title="Mobile number must be exactly 10 digits"
                className={textFieldStyle}
              />
              {/* 如果 actionData?.error?.mobileNumber 存在(List<String>)，則顯示錯誤訊息 */}
              {actionData?.error?.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.error.mobileNumber.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelStyle}>
              密碼
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Your Password"
              required
              autoComplete="new-password"
              minLength={4}
              maxLength={20}
              className={textFieldStyle}
            />
            {/* 如果 actionData?.error?.password 存在(List<String>)，則顯示錯誤訊息 */}
            {actionData?.error?.password && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.password.join(", ")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPwd" className={labelStyle}>
              確認密碼
            </label>
            <input
              id="confirmPwd"
              type="password"
              name="confirmPwd"
              placeholder="Confirm Your Password"
              required
              autoComplete="confirm-password"
              minLength={4}
              maxLength={20}
              className={textFieldStyle}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting} // 送出時禁用按鈕
            className="w-full px-6 py-2 text-white dark:text-black text-xl bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter rounded-md transition duration-200"
          >
            {isSubmitting ? "註冊中..." : "Register"}
          </button>
        </Form>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          已經有帳號?{" "}
          <Link
            to="/login"
            className="text-brand dark:text-light hover:text-dark dark:hover:text-brand transition duration-200"
          >
            登入
          </Link>
        </p>
      </div>
    </div>
  );
}

// 處理註冊表單提交 after handleSubmit
export async function registerAction({ request }) {
  const data = await request.formData(); // 從 request 中提取表單數據 .formData() 來自 submit 方法 帶入的 formData

  // 構建註冊數據對象
  const registerPayload = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    password: data.get("password"),
  };

  try {
    const response = await apiClient.post("/auth/register", registerPayload); // 發送註冊 Api 請求
    return { success: true }; // 返回成功響應
  } catch (error) {
    if (error.response?.status === 400) {
      // 如果後端返回 400 錯誤 (Backend Validation fails: MethodArgumentNotValidException)
      return { success: false, error: error.response?.data }; // error.response.data 後端返回的錯誤信息
      // 後端返回 400 錯誤 ，表示表單數據驗證失敗，這時候我們不拋出錯誤，而是返回一個包含 success: false 和 error 信息的對象 Map<欄位名稱, 錯誤訊息列表>，這樣 useActionData 就可以捕獲到這個對象，並且在組件中使用它來顯示具體的錯誤信息給用戶，而不是顯示一個通用的錯誤消息。
    }

    // 其他錯誤
    const backendMessage =
      error.response?.data?.errorMessage || // 後端 Global Exceptiona Handler 返回的錯誤消息
      error.message || // Axios error 物件中的 message 屬性
      "無法提交聯絡信息，請稍後再試。"; // 默認錯誤消息

    // 導向 ErrorPage.jsx 來顯示錯誤消息
    throw new Response(backendMessage, {
      status:
        error.response?.status || // Axios error 物件中的 response.status 屬性
        500, // 默認錯誤狀態碼
    });
  }
}
