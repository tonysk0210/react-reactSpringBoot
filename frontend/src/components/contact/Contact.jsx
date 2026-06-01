import PageTitle from "../home/PageTitle";
import apiClient from "../../api/apiClient";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  redirect,
  useSubmit,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

// style variables
const labelStyle =
  "block text-lg font-semibold text-brand dark:text-light mb-2";
const textFieldStyle =
  "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

export default function Contact() {
  // 讀取最近一次 contactAction return 的資料。
  // 初始值為 undefined；成功時會是 { success: true }，後端驗證失敗時會是 { success: false, error: ... }。
  // 如果 action throw Response，則會進入 errorElement，不會由 useActionData 接收。
  const actionData = useActionData();

  // formRef 是跨 render 保持不變的 ref object。
  // null 是 formRef.current 的初始值，當 <Form ref={formRef}> 掛載後，formRef.current 會指向 form DOM 元素。(取得 actual DOM)
  // contactAction 成功後，useEffect 會呼叫 formRef.current.reset()，將表單欄位恢復到初始值。
  const formRef = useRef(null);

  // useSubmit 會回傳 React Router 的 submit 函式，可用來用程式手動觸發 route action。
  // 這裡在 handleSubmit 中先阻止 Form 的預設提交，等使用者確認後，
  // 再用 submit(formData, { method: "post" }) 將表單資料交給 contactAction 處理。
  const submit = useSubmit();

  const contactInfo = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // 2. 定義 handleSubmit 函數，這個函數會在表單提交時被觸發，並且使用 useSubmit 來手動觸發表單提交，從而調用 contactAction 函數來處理表單數據。
  const handleSubmit = (event) => {
    event.preventDefault(); // 阻止 <Form> 立即提交，等使用者確認後再用 submit() 手動送出。既然阻止了，就必須自己手動送出 formData 給到 contactAction
    const userConfirmed = window.confirm("您確定要提交表單嗎？");

    if (userConfirmed) {
      const formData = new FormData(formRef.current); // 從目前表單 DOM 收集所有有 name 的欄位資料。
      submit(formData, { method: "post" }); // 手動用 POST 提交 FormData，觸發目前 route 的 contactAction。
    } else {
      toast.info("表單提交已取消"); // 使用 react-toastify 的 toast 函數來顯示一個信息提示，告訴用戶表單提交已經被取消了。
    }
  };

  // 3. 使用 useEffect 來監聽 actionData 的變化，當 actionData 中的 success 屬性為 true 時，會重置表單並顯示一個成功提交的提示。
  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset(); // 重置表單，清空表單中的所有輸入字段，恢復到初始狀態。
      toast.success("您的信息已成功提交，我們會盡快與您聯繫！", {
        toastId: "contact-submit-success", // 設置 toastId 來避免重複顯示相同的通知
        style: {
          width: "450px",
          maxWidth: "90vw",
          whiteSpace: "nowrap", // 防止文本換行，保持在一行內顯示
        },
      });
    }
  }, [actionData]);

  return (
    <div className="max-w-6xl min-h-213 mx-auto px-6 py-8 font-brand bg-normalbg dark:bg-darkbg">
      <PageTitle title="聯絡我們" />
      <p className="max-w-3xl mx-auto mt-8 text-gray-600 dark:text-lighter mb-8 text-center">
        對產品有任何問題或建議嗎？歡迎隨時與我們聯繫，我們非常重視您的寶貴意見。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-238 mx-auto mt-8">
        {/* Left: 聯絡資訊 */}
        <div className="text-brand dark:text-light  p-6">
          <h2 className="text-2xl font-semibold mb-4">聯絡資訊</h2>
          {/* 如果 contactInfo 存在   */}
          {contactInfo && (
            <>
              <p className="mb-4">
                <strong>電話:</strong> {contactInfo.phone}
              </p>
              <p className="mb-4">
                <strong>Email:</strong> {contactInfo.email}
              </p>
              <p className="mb-4">
                <strong>地址:</strong> {contactInfo.address}
              </p>
            </>
          )}
        </div>
        {/*  Form 組件的 onSubmit 事件處理器，當表單提交時會觸發 handleSubmit 函數，這個函數會使用 useSubmit hook 來手動觸發表單提交，
        從而調用 contactAction 函數來處理表單數據。ref 屬性用於引用表單元素，以便在提交成功後重置表單。 */}
        <Form
          method="POST"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {/* Name Field */}
          <div>
            <label htmlFor="name" className={labelStyle}>
              姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              className={textFieldStyle}
              required
              minLength={2}
              maxLength={30}
            />
            {actionData?.error?.name && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.name.join(", ")}
                {/* 從 actionData 中獲取 name 字段的錯誤信息，並且使用 join(", ") 將錯誤信息列表轉換成一個以逗號分隔的字符串，這樣就可以在 UI 上顯示具體的錯誤信息給用戶，而不是顯示一個通用的錯誤消息。 */}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your Email"
                className={textFieldStyle}
                required
              />
              {actionData?.error?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.error.email.join(", ")}
                  {/* 從 actionData 中獲取 email 字段的錯誤信息，並且使用 join(", ") 將錯誤信息列表轉換成一個以逗號分隔的字符串，這樣就可以在 UI 上顯示具體的錯誤信息給用戶，而不是顯示一個通用的錯誤消息。 */}
                </p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label htmlFor="mobileNumber" className={labelStyle}>
                手機號碼
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                pattern="^\d{10}$"
                title="Mobile number must be exactly 10 digits"
                placeholder="Your Mobile Number"
                className={textFieldStyle}
              />
              {actionData?.error?.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.error.mobileNumber.join(", ")}
                  {/* 從 actionData 中獲取 mobileNumber 字段的錯誤信息，並且使用 join(", ") 將錯誤信息列表轉換成一個以逗號分隔的字符串，這樣就可以在 UI 上顯示具體的錯誤信息給用戶，而不是顯示一個通用的錯誤消息。 */}
                </p>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className={labelStyle}>
              您的意見
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Your Message"
              className={textFieldStyle}
              required
              minLength={5}
              maxLength={500}
            ></textarea>
            {actionData?.error?.message && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.message.join(", ")}
                {/* 從 actionData 中獲取 message 字段的錯誤信息，並且使用 join(", ") 將錯誤信息列表轉換成一個以逗號分隔的字符串，這樣就可以在 UI 上顯示具體的錯誤信息給用戶，而不是顯示一個通用的錯誤消息。 */}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting} // 當 isSubmitting 為 true 時，禁用提交按鈕，防止用戶在提交過程中重複點擊
              className="px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
            >
              {isSubmitting ? "提交中..." : "送出信息"}{" "}
              {/* 根據 isSubmitting 的值來動態顯示按鈕文本 */}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

// 1. contactAction 是一個 async 函數，用於處理聯絡表單的提交。
export async function contactAction({ request, params }) {
  // 1-1. 從 request 中提取表單數據
  const data = await request.formData();

  // 1-2. 構建一個 contactPayload 對象，這些鍵對應於表單元素的 name 屬性。
  const contactPayload = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    message: data.get("message"),
  };

  try {
    // 1-3. 發送 POST 請求到 "/contacts" 端點，將 contactPayload 作為請求體
    await apiClient.post("/contacts", contactPayload);
    return { success: true }; // 返回一個 success 的響應，表示表單提交成功。 useActionData hook 可以捕獲這個響應
    // return redirect("/home"); // redirect 是一個 function，可以用來在 action 中進行頁面重定向；當 contactAction 成功後，會重定向到 "/home" 頁面。
  } catch (error) {
    if (error.response?.status === 400) {
      // Axios 從後端 HTTP response 讀到的數字 status code (Backend Validation fails)
      return { success: false, error: error.response?.data }; // 後端 validationErrors 回傳的錯誤訊息 (GlobalExceptionHandler 裡面定義的 handleValidationException() 會回傳一個 validationErrors 物件
      /*
      validationErrors 物件的結構會是這樣的：
      {
        "name": [
          "名字是必填的",
          "名字必須在 2 到 30 個字符之間"
        ],
        "email": [
          "無效的電子郵件地址"
        ]
      }
      */
    }

    // 非 400 的錯誤 處理方式 轉 useRouteError 處理由 ErrorPage.jsx 顯示
    const backendMessage =
      error.response?.data?.errorMessage ||
      error.message ||
      "無法提交聯絡信息，請稍後再試。";

    throw new Response(backendMessage, {
      status: error.response?.status || 500,
    });
  }
}

// 這是一個 loader 函數，用於在 Contact 頁面加載時從後端獲取聯絡信息的數據。它使用 apiClient 發送 GET 請求到 "/contacts" 端點，並返回響應數據。如果請求失敗，它會拋出一個帶有錯誤信息的 Response 對象，這樣 React Router 就可以捕獲到這個錯誤並在 UI 上顯示相應的錯誤消息。
export async function contactLoader() {
  try {
    const response = await apiClient.get("/contacts"); // Axios GET Request
    return response.data;
  } catch (error) {
    // 建立一個後端錯誤消息，優先使用後端響應中的錯誤消息
    const backendMessage =
      error.response?.data?.errorMessage || // 從後端錯誤響應中提取錯誤消息，如果沒有則使用 Axios error 物件中的 message 屬性，如果還沒有，則會使用一個默認的錯誤消息 "無法提交聯絡信息，請稍後再試。"。
      error.message ||
      "無法獲取聯絡信息，請稍後再試。";
    throw new Response(backendMessage, {
      status: error.response?.status || 500,
    });
  }
}
