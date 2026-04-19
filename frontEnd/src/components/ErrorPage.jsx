import React from "react";
import Header from "./Header";
import Footer from "./footer/Footer";
import PageTitle from "./home/PageTitle";

import errorImage from "../assets/util/error.png"; // 引入錯誤圖片；

import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
// 引入 useRouteError 鉤子；這個鉤子是 React Router 中用於獲取路由錯誤信息的鉤子，當路由匹配失敗或發生錯誤時，可以使用這個鉤子來獲取錯誤的詳細信息，例如：錯誤狀態碼、錯誤消息等等。

export default function ErrorPage() {
  const routeError = useRouteError(); // 使用 useRouteError hook 來獲取當前路由的錯誤信息，這個錯誤信息會在路由匹配失敗或發生錯誤時被填充，包含了錯誤的狀態碼、錯誤消息等詳細信息，可以用來在錯誤頁面中顯示給用戶。
  let errorTitle = "喔喔！發生錯誤了！";
  let errorMessage = "請稍後再試一次，或聯絡客服人員。";

  // isRouteErrorResponse ===  true 包含 throw new Response() & URL 不存在
  if (isRouteErrorResponse(routeError)) {
    // Response 型錯誤（404/500）
    errorTitle = routeError.status; // 錯誤狀態碼，例如：404、500 等等
    errorMessage = routeError.data || routeError.statusText; // 錯誤消息，優先使用 data 屬性，如果沒有則使用 statusText 屬性
  } else if (routeError instanceof Error) {
    // Error 物件型錯誤（JS 錯誤）
    errorMessage = routeError.message; // 錯誤消息，使用 Error 物件的 message 屬性
  }

  return (
    <div className="flex flex-col min-h-245">
      <Header />

      {/* Main Content */}
      <main className="grow">
        <div className="py-12 bg-normalbg dark:bg-darkbg font-primary">
          <div className="max-w-4xl mx-auto px-4">
            <PageTitle title={errorTitle} />
          </div>
          <div className="text-center text-gray-600 dark:text-lighter flex flex-col items-center">
            <p className="max-w-xl px-2 mx-auto leading-6 mb-4">
              {errorMessage}
            </p>
            <img
              src={errorImage}
              alt="Error"
              className="w-full max-w-xl mx-auto mb-6"
            />
            <Link
              to="/home"
              className="py-3 px-6 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
