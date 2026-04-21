import React from "react";
import PageTitle from "../home/PageTitle";
import { Form } from "react-router-dom";
import { useActionData, useNavigation, useSubmit } from "react-router-dom";
import { useEffect, useRef } from "react";
import { redirect } from "react-router-dom";
import apiClient from "../../api/apiClient"; // 引入 apiClient 模塊，這個模塊是用來發送 HTTP 請求的，通常是使用 axios 或者 fetch 包裝的一個工具函數，用於與後端 API 進行通信。

export default function Contact() {
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
      {/* 使用 React Router 的 Form 組件來創建一個表單，這個表單會在提交時觸發 contactAction 函數來處理表單數據。 */}
      <Form method="POST" className="space-y-6 max-w-3xl mx-auto">
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
            className="px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
          >
            送出信息
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
export async function contactAction({ request }) {
  // 1. 從請求中提取表單數據
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
    return { success: true }; // 返回一個 success 的響應，表示表單提交成功
    // return redirect("/home");
  } catch (error) {
    throw new Response(
      error.response?.data?.message || "無法提交聯絡信息，請稍後再試。",
      { status: error.response?.status || 500 },
    );
  }
}
