import React from "react";
import PageTitle from "../home/PageTitle";
import { Link } from "react-router-dom";

export default function Login() {
  const labelStyle =
    "block text-lg font-semibold text-brand dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  return (
    <div className="min-h-213 flex items-center justify-center font-brand dark:bg-darkbg">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6">
        {/* Title */}
        <PageTitle title="登入" />
        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="username" className={labelStyle}>
              使用者名稱
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Your Username"
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
              required
              minLength={8}
              maxLength={20}
              className={textFieldStyle}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
            >
              登入
            </button>
          </div>
        </form>

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
