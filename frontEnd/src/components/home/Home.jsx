import PageHeading from "./PageHeading";
import ProductListing from "./product/ProductListing";

import products from "../../data/products"; // 從 data/products.js 匯入產品資料
import apiClient from "../../api/apiClient"; // 從 api/apiClient.js 匯入 API 客戶端

import { useState, useEffect } from "react";

export default function Home() {
  const [products, setProducts] = useState([]); // 定義一個狀態來存儲產品資料
  const [loading, setLoading] = useState(true); // 定義一個狀態來表示是否正在加載資料
  const [error, setError] = useState(null); // 定義一個狀態來表示是否發生錯誤

  // 定義一個函數來從後端 API 獲取產品資料
  const fetchProducts = async () => {
    try {
      setLoading(true); // 設置加載狀態為 true
      const response = await apiClient.get("/products"); // 後端 API 的端點是 /products
      setProducts(response.data); // 將獲取到的產品資料存儲到狀態中 }
    } catch (err) {
      console.error("獲取產品資料失敗:", err);
      setError(err.response?.data?.message || "無法獲取產品資料，請稍後再試。"); //
    } finally {
      setLoading(false); // 設置加載狀態為 false
    }
  };

  // 使用 useEffect 在組件掛載時獲取產品資料
  useEffect(() => {
    fetchProducts(); // 在組件掛載時從後端 API 獲取產品資料 render 後會執行這個函數
  }, []); // 空依賴陣列表示只在組件掛載時執行一次

  // 1. 顯示加載狀態
  if (loading == true) {
    return (
      // 使用 Tailwind CSS 的類來居中顯示內容
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl font-semibold text-purple-700">
          Loading 產品中...
        </span>
      </div>
    );
  }

  // 2. 顯示錯誤訊息 if (value) 不是檢查 true/false，而是檢查 truthy / falsy。
  // 如果 error 是 null 或 undefined，這裡的 if 就不會進入，直接跳過到 return 的部分。
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl font-semibold text-red-500">
          Error: {error}
        </span>
      </div>
    );
  }

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
