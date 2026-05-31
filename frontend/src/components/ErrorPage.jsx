import React from "react";
import Header from "./Header";
import Footer from "./footer/Footer";
import PageTitle from "./home/PageTitle";
import errorImage from "../assets/util/error.png"; // 引入錯誤圖片；

import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  /**
  會觸發 errorElement 的情況包含：
  1. route loader 裡 throw error
  2. route action 裡 throw error
  3. route component render 時出錯
  4. 使用者進入不存在的路由
   */
  const routeError = useRouteError(); // useRouteError 取得當前路由的錯誤資訊

  let errorTitle = "喔喔！發生錯誤了！";
  let errorMessage = "請稍後再試一次，或聯絡客服人員。";

  /**
  isRouteErrorResponse(routeError) 回傳 true 的條件就是「被 throw 的是 new Response()」
  → 通常有 status / statusText / data

  routeError instanceof Error
  → 通常有 message

  ErrorPage 讀取	        來源
  routeError.status	      new Response 的 status
  routeError.data	        new Response 的第一個參數（body）
  routeError.statusText	  new Response 的 statusText
   */
  if (isRouteErrorResponse(routeError)) {
    // throw new Response(...) 的錯誤
    errorTitle = routeError.status || errorTitle; // 錯誤標題，通常是 404、500 這種 HTTP status code
    errorMessage = routeError.data || errorMessage; // 錯誤信息，通常是後端 API 回傳的錯誤訊息，或者 HTTP statusText（例如：Not Found、Internal Server Error），如果都沒有就使用預設的錯誤訊息
  } else if (routeError instanceof Error) {
    // throw new Error(...) 的錯誤
    errorMessage = routeError.message || errorMessage; // 錯誤訊息，可以是 JavaScript Error 物件的 message 屬性，如果沒有就使用預設的錯誤訊息
  }

  return (
    <div className="flex flex-col min-h-245">
      <Header />
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
              回到首頁
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * 某個 route 的 loader / action / component 發生錯誤
 * ↓
 * throw new Response(...) 或 throw new Error(...)
 * ↓
 * React Router 捕捉錯誤
 * ↓
 * 找到最近的 errorElement
 * ↓
 * 渲染 <ErrorPage />
 * ↓
 * ErrorPage 裡用 useRouteError() 取得剛剛那個錯誤
 */
