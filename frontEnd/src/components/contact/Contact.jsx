import PageTitle from "../home/PageTitle";
import apiClient from "../../api/apiClient"; // 引入 apiClient 模塊，這個模塊是用來發送 HTTP 請求的，通常是使用 axios 或者 fetch 包裝的一個工具函數，用於與後端 API 進行通信。
import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  useSubmit,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify"; // 引入 react-toastify 的 toast 函數；這個函數是用來顯示 toast 通知的，可以用來在表單提交成功或者失敗時給用戶一個提示。

export default function Contact() {
  const actionData = useActionData(); // useActionData 是 React Router 提供的一個 hook，用於在組件中獲取 action 函數返回的數據。在這個組件中，當 contactAction 函數被調用並返回數據後，這些數據會被 useActionData 捕獲並存儲在 actionData 變量中。 一開始是 undefined，當 contactAction 返回 { success: true } 時，actionData 就會變成 { success: true }。
  const formRef = useRef(null); // useRef 是 React 提供的一個 hook，用於創建一個可變的 ref 對象，這個對象在組件的整個生命周期內保持不變。在這裡，formRef 被用來引用表單元素，當表單提交成功後，可以通過 formRef.current.reset() 來重置表單。 current 屬性指向表單 DOM 元素，reset() 方法會清空表單中的所有輸入字段，恢復到初始狀態。
  // formRef 在 mounted 後會指向表單元素，當 contactAction 返回成功的響應後， useEffect 會檢測到 actionData 的變化，並且當 actionData.success 為 true 時，會調用 formRef.current.reset() 來重置表單，並顯示一個提示框告訴用戶信息已成功提交。
  // formRef 用來在元件掛載後取得該 form 的 DOM 節點，方便進行原生 DOM 操作，例如 reset()。

  const navigation = useNavigation(); // useNavigation 是 React Router 提供的一個 hook，用於獲取當前導航狀態的 hook，可以用來判斷當前是否正在進行導航，例如：正在加載新頁面、正在提交表單等等，從而可以在 UI 上顯示相應的加載指示器或者禁用某些按鈕等等。在這個組件中，當表單提交時，navigation.state 會變為 "submitting"，當提交完成後，navigation.state 會變為 "idle"。
  const isSubmitting = navigation.state === "submitting"; // 定義一個變量 isSubmitting，用於判斷當前是否正在提交表單，這個變量會在 UI 上用來禁用提交按鈕，防止用戶在提交過程中重複點擊。 useNavigation的state 改變時，會觸發組件rerendering，從而更新 isSubmitting 的值。

  const submit = useSubmit(); // useSubmit 是 React Router 提供的一個 hook，用於在組件中手動觸發表單提交的 hook，可以用來在某些特定的事件或者條件下觸發表單提交，例如：當用戶點擊一個按鈕時，或者當某些數據發生變化時等等。在這個組件中，useSubmit 沒有被直接使用到，但它可以用來在其他地方觸發表單提交，例如：submit(formRef.current) 來觸發 formRef 引用的表單的提交。
  // useSubmit 可以用來在 handleSubmit 函數中手動觸發表單提交，從而調用 contactAction 函數來處理表單數據。當用戶點擊提交按鈕時，handleSubmit 函數會被觸發，這個函數會使用 useSubmit 來觸發表單提交，從而調用 contactAction 函數來處理表單數據。
  const handleSubmit = (event) => {
    event.preventDefault(); // 阻止表單的默認提交行為，這樣就不會觸發瀏覽器的頁面刷新
    const userConfirmed = window.confirm("您確定要提交表單嗎？");

    if (userConfirmed) {
      const formData = new FormData(formRef.current); // 從 formRef 引用的表單DOM元素中創建一個 FormData 對象，這個對象會自動收集表單中的所有輸入字段的數據，並且可以直接傳遞給 submit 函數來觸發表單提交。
      submit(formData, { method: "post" }); // 使用 useSubmit 函數來觸發表單提交，將 formData 作為參數傳遞給 submit 函數，並且指定 method 為 "post"，這樣就會觸發 contactAction 函數來處理表單數據。
    } else {
      toast.info("表單提交已取消"); // 使用 react-toastify 的 toast 函數來顯示一個信息提示，告訴用戶表單提交已經被取消了。
    }
  };

  // submit (actionData) 後的 side effect
  useEffect(() => {
    if (actionData?.success) {
      formRef.current.reset(); // 重置表單 ; formRef.current 指向表單DOM元素，reset() 方法會清空表單中的所有輸入字段，恢復到初始狀態。
      // alert("您的信息已成功提交，我們會盡快與您聯繫！");
      toast.success("您的信息已成功提交，我們會盡快與您聯繫！"); // 使用 react-toastify 的 toast 函數來顯示一個成功提交的提示，這樣用戶就會看到一個彈出通知，告訴他們信息已成功提交，而不是使用 alert 彈窗。
    }
  }, [actionData]); // 這個 useEffect 監聽 actionData 的變化，當 actionData 中的 success 屬性為 true 時，會重置表單並顯示一個成功提交的提示。

  const labelStyle =
    "block text-lg font-semibold text-brand dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";
  return (
    <div className="max-w-6xl min-h-213 mx-auto px-6 py-8 font-brand bg-normalbg dark:bg-darkbg">
      {/* Page Title */}
      <PageTitle title="聯絡我們" />
      {/* Contact Info */}
      <p className="max-w-3xl mx-auto mt-8 text-gray-600 dark:text-lighter mb-8 text-center">
        對產品有任何問題或建議嗎？歡迎隨時與我們聯繫，我們非常重視您的寶貴意見。
      </p>
      {/* Contact Form */}
      {/* 使用 React Router 的 Form 組件來創建一個表單，這個表單會在提交時觸發 contactAction 函數來處理表單數據。 
      method 屬性指定表單提交的 HTTP 方法，這裡使用 POST 方法 ; ref 屬性用於引用表單元素，以便在提交成功後重置表單 */}
      <Form
        method="POST"
        ref={formRef}
        onSubmit={handleSubmit} // onSubmit 事件處理器，當表單提交時會觸發 handleSubmit 函數，這個函數會使用 useSubmit hook 來手動觸發表單提交，從而調用 contactAction 函數來處理表單數據。
        className="space-y-6 max-w-3xl mx-auto"
      >
        {/* Name Field */}
        <div>
          <label htmlFor="name" className={labelStyle}>
            姓名
          </label>
          <input
            id="name"
            name="name" // name 屬性是表單數據的鍵，函數中會使用 data.get("name") 來獲取這個字段的值
            type="text"
            placeholder="Your Name"
            className={textFieldStyle}
            required
            minLength={5}
            maxLength={30}
          />
        </div>

        {/* Email and mobile Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email" // name 屬性是表單數據的鍵，函數中會使用 data.get("email") 來獲取這個字段的值
              type="email"
              placeholder="Your Email"
              className={textFieldStyle}
              required
            />
          </div>

          {/* Mobile Field */}
          <div>
            <label htmlFor="mobileNumber" className={labelStyle}>
              手機號碼
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber" // name 屬性是表單數據的鍵，函數中會使用 data.get("mobileNumber") 來獲取這個字段的值
              type="tel"
              required
              pattern="^\d{10}$"
              title="Mobile number must be exactly 10 digits"
              placeholder="Your Mobile Number"
              className={textFieldStyle}
            />
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className={labelStyle}>
            您的意見
          </label>
          <textarea
            id="message"
            name="message" // name 屬性是表單數據的鍵，函數中會使用 data.get("message") 來獲取這個字段的值
            rows="4"
            placeholder="Your Message"
            className={textFieldStyle}
            required
            minLength={5}
            maxLength={500}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting} // 當 isSubmitting 為 true 時，禁用提交按鈕，防止用戶在提交過程中重複點擊
            className="px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
          >
            {isSubmitting ? "提交中..." : "送出信息"}{" "}
            {/* 根據 isSubmitting 的值來動態顯示按鈕文本，當正在提交時顯示 "提交中..."，否則顯示 "送出信息" */}
          </button>
        </div>
      </Form>
    </div>
  );
}

// contactAction 是用於處理表單提交的 action 函數，當用戶提交聯絡表單時，這個函數會被調用。
// 它從請求中提取表單數據，構建一個 contactData 對象，然後使用 apiClient 發送 POST 請求到 "/contacts" 端點。
// 如果請求成功，它會返回一個 success 的響應；如果失敗，它會拋出一個帶有錯誤信息的 Response 對象。
// request 來自於 React Router 的 action 函數參數，包含了表單提交的相關信息；
// params 包含了路由參數，但在這個函數中沒有使用到。

export async function contactAction({ request, params }) {
  const data = await request.formData();

  // 2. 構建一個 contactPayload 對象，這個對象包含了從表單數據中提取的 name、email、mobileNumber 和 message 字段，這些字段的值分別是 data.get("name")、data.get("email")、data.get("mobileNumber") 和 data.get("message")。這些鍵對應於表單中 input 和 textarea 元素的 name 屬性。
  const contactPayload = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    message: data.get("message"),
  };

  try {
    // 3. 發送 POST 請求到 "/contacts" 端點，將 contactPayload 作為請求體
    await apiClient.post("/contacts", contactPayload);
    return { success: true }; // 返回一個 success 的響應，表示表單提交成功。
    // useActionData 可以捕獲這個響應並在組件中使用它來顯示成功消息或者進行其他操作。
    // return redirect("/home");
  } catch (error) {
    throw new Response(
      error.response?.data?.message || "無法提交聯絡信息，請稍後再試。",
      { status: error.response?.status || 500 },
    );
  }
}
