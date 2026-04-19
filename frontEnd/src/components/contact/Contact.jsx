import React from "react";
import PageTitle from "../home/PageTitle";
import { Form } from "react-router-dom";
import { useActionData, useNavigation, useSubmit } from "react-router-dom";
import { useEffect, useRef } from "react";
import { redirect } from "react-router-dom";

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
      <form className="space-y-6 max-w-3xl mx-auto">
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
              name="email"
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
              name="mobileNumber"
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
            name="message"
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
      </form>
    </div>
  );
}

export async function contactAction({ request, params }) {
  const data = await request.formData();

  const contactData = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    message: data.get("message"),
  };
  try {
    await apiClient.post("/contacts", contactData);
    return { success: true };
    // return redirect("/home");
  } catch (error) {
    throw new Response(
      error.message || "Failed to submit your message. Please try again.",
      { status: error.status || 500 },
    );
  }
}
