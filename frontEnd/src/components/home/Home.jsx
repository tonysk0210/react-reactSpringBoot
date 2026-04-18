import PageHeading from "./PageHeading";
import ProductListing from "./ProductListing";

// import products from "../../data/products"; // 從 data/products.js 匯入產品資料
import apiClient from "../../api/apiClient"; // 從 api/apiClient.js 匯入 API 客戶端

import { useState, useEffect } from "react";

export default function Home() {
  const [products, setProducts] = useState([]); // 定義一個狀態來存儲產品資料

  // 定義一個函數來從後端 API 獲取產品資料
  const fetchProducts = async () => {
    const response = await apiClient.get("/products"); // 後端 API 的端點是 /products
    setProducts(response.data); // 將獲取到的產品資料存儲到狀態中
  };

  // 使用 useEffect 在組件掛載時獲取產品資料
  useEffect(() => {
    fetchProducts(); // 在組件掛載時從後端 API 獲取產品資料 render 後會執行這個函數
  }, []); // 空依賴陣列表示只在組件掛載時執行一次

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
