import PageHeading from "./PageHeading";
import ProductListing from "./product/ProductListing";

// import products from "../../data/products"; // 從 data/products.js 匯入產品資料
import apiClient from "../../api/apiClient"; // 從 api/apiClient.js 匯入 API 客戶端

import { useState, useEffect } from "react";

import { useLoaderData } from "react-router-dom"; // 引入 useLoaderData hook；
// 這個 hook 是 React Router 中用於在組件中獲取由 loader 函式加載的資料的 hook，當路由匹配到 Home 組件時，會調用 productsLoader 函式來獲取產品資料，然後在 Home 組件中使用 useLoaderData 來獲取這些資料並存儲在 products 變數中。

export default function Home() {
  // const [products, setProducts] = useState([]); // 定義一個狀態來存儲產品資料
  // const [loading, setLoading] = useState(true); // 定義一個狀態來表示是否正在加載資料
  // const [error, setError] = useState(null); // 定義一個狀態來表示是否發生錯誤

  // // 定義一個函數來從後端 API 獲取產品資料
  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true); // 設置加載狀態為 true
  //     const response = await apiClient.get("/products"); // 後端 API 的端點是 /products
  //     setProducts(response.data); // 將獲取到的產品資料存儲到狀態中 }
  //   } catch (err) {
  //     console.error("獲取產品資料失敗:", err);
  //     setError(err.response?.data?.message || "無法獲取產品資料，請稍後再試。"); //
  //   } finally {
  //     setLoading(false); // 設置加載狀態為 false
  //   }
  // };

  // // 使用 useEffect 在組件掛載時獲取產品資料
  // useEffect(() => {
  //   fetchProducts(); // 在組件掛載時從後端 API 獲取產品資料 render 後會執行這個函數
  // }, []); // 空依賴陣列表示只在組件掛載時執行一次

  // // 1. 顯示加載狀態
  // if (loading == true) {
  //   return (
  //     // 使用 Tailwind CSS 的類來居中顯示內容
  //     <div className="flex items-center justify-center min-h-screen">
  //       <span className="text-xl font-semibold text-purple-700 dark:text-light">
  //         Loading 產品中...
  //       </span>
  //     </div>
  //   );
  // }

  // // 2. 顯示錯誤訊息 if (value) 不是檢查 true/false，而是檢查 truthy / falsy。
  // // 如果 error 是 null 或 undefined，這裡的 if 就不會進入，直接跳過到 return 的部分。
  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <span className="text-xl font-semibold text-red-500">
  //         Error: {error}
  //       </span>
  //     </div>
  //   );
  // }

  // 從 useLoaderData 鉤子中獲取由 productsLoader 函式加載的產品資料，並存儲在 products 變數中。
  const products = useLoaderData();

  // 3. 正常顯示產品列表
  return (
    <div className="home-container">
      <PageHeading title="歡迎來到首頁！">
        這是一個簡單的 React + SpringBoot 應用
        ，展示了如何使用組件來構建頁面結構。您可以在這裡瀏覽我們的產品列表，了解更多關於我們的信息，或者聯繫我們的客服團隊。
        {/* children 傳給 PageHeading，然後 PageHeading 再傳給 p 標籤 */}
      </PageHeading>

      {/* 產品列表 */}
      <ProductListing products={products} />
    </div>
  );
}

// 定義一個 loader 函數，這個函數會在路由匹配到 Home 組件時被調用，用來預先獲取產品資料
export async function productsLoader() {
  try {
    const response = await apiClient.get("/products"); // Axios GET Request
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.message || "無法獲取產品資料，請稍後再試。",
      { status: error.response?.status || 500 },
    );
  }
}

// Spring Boot 後端
//    ↓
// HTTP 錯誤回應
//    ↓
// Axios 包裝成 error 物件
//    ↓
// loader catch 到 error
//    ↓
// throw new Response(...)
//    ↓
// React Router 接住並轉成 routeError
//    ↓
// ErrorPage 用 useRouteError() 顯示

// 1. 如果你沒有自訂全域錯誤格式，Spring Boot 常見會回這種預設錯誤 JSON：
// {
//   "timestamp": "2026-04-19T12:00:00",
//   "status": 500,
//   "error": "Internal Server Error",
//   "path": "/products"
// }

// 2. Axios：把 HTTP 錯誤包成 error 物件。因為後端回 500，Axios 不會進 try 的 return response.data，而是直接丟到 catch
// error = {
//   message: "Request failed with status code 500",　　　　　　　// Axios 自己產生的技術訊息
//   response: {
//     status: 500,
//     data: {                                                   // 後端回傳的 body
//       timestamp: "2026-04-19T12:00:00",
//       status: 500,
//       error: "Internal Server Error",
//       path: "/products"
//     }
//   }
// }

// 3 Loader：把 Axios error 轉成 Response error
// throw new Response(
//   "無法獲取產品資料，請稍後再試。",                               // routeError.data - 第一個參數 body
//   { status: 500 }                                              // routeError.status - status
// );

//***
// new Response(body, { status })
// ↓
// Response {
//   body: body                  ← 你給的
//   status: status              ← 你給的
//   statusText: 自動補           ← 瀏覽器
// }
// ↓
// routeError {
//   data: body
//   status: status
//   statusText: statusText
// }
//***

// 4. React Router：接住 Response，轉成 routeError
// routeError = {
//   status: 500,
//   statusText: "Internal Server Error",
//   data: "無法獲取產品資料，請稍後再試。"
// }

// Response.body → routeError.data
// Response.status → routeError.status
// Response.statusText → routeError.statusText
