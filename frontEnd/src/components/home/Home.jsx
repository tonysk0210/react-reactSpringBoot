import PageHeading from "./PageHeading";
import ProductListing from "./ProductListing";

import products from "../../data/products"; // 從 data/products.js 匯入產品資料

export default function Home() {
  return (
    <div className="home-container">
      <PageHeading title="歡迎來到首頁！">
        這是一個簡單的
        React應用，展示了如何使用組件來構建頁面結構。您可以在這裡添加更多內容，讓首頁更加豐富多彩。
        {/* children 傳給 PageHeading，然後 PageHeading 再傳給 p 標籤 */}
      </PageHeading>

      {/* 產品列表 */}
      <ProductListing products={products} />
    </div>
  );
}
