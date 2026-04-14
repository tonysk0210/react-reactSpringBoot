import PageHeading from "./PageHeading";
import ProductListing from "./ProductListing";

import products from "../../data/products"; // 從 data/products.js 匯入產品資料

export default function Home() {
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
