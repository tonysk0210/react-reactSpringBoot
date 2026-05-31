import PageHeading from "./PageHeading";
import ProductListing from "./product/ProductListing";
import apiClient from "../../api/apiClient";
import { useLoaderData, useLocation } from "react-router-dom";

export default function Home() {
  // 2. useLoaderData() 來獲取 productsLoader return 的產品資料; 所有 Home 的子組件都可以用 useLoaderData() 來獲取這些資料。
  const products = useLoaderData();

  const location = useLocation(); // 使用 useLocation hook 來獲取當前路由的位置信息，這個信息包含了導航過程中傳遞的 state
  /* location = {
    pathname: "/home",   // 路徑
    search: "?q=abc",    // query string
    hash: "#section1",   // hash
    state: {...},        // 👈 你傳的東西
    key: "abc123"        // 每次導航的唯一 id
  } */
  console.log("Cart.jsx 「返回商品」回傳的 state", location.state); // 在控制台輸出當前路由的位置信息，這樣你就可以看到導航過程中傳遞的狀態，例如：username: "Anthony"，從而可以確認是否成功獲取到這些狀態。

  return (
    <div className="home-container">
      <PageHeading title="歡迎來到首頁！">
        這是一個簡單的 React + SpringBoot 應用
        ，展示了如何使用組件來構建頁面結構。您可以在這裡瀏覽我們的產品列表，了解更多關於我們的信息，或者聯繫我們的客服團隊。
        {/* children 就是標籤之間的內容 */}
      </PageHeading>

      {/* 產品列表 component 帶入 products array 需要從後端 API 獲取 */}
      <ProductListing products={products} />
    </div>
  );
}

// 1. 定義 loader 函式 productsLoader；當路由匹配到 Home 時，React Router 會在 render Home 前先執行它取得產品資料。
export async function productsLoader({ params, request }) {
  try {
    const response = await apiClient.get("/products"); // 從後端 API 的 /products 端點獲取產品資料
    return response.data; // 1.1. React Router 會把這個 return 值提供給 Home，Home 再用 useLoaderData() 取得
  } catch (error) {
    // 這裡的 error 是 apiClient.get(...) 這個 Promise rejected 後，由 await 丟出的 Axios error

    // 1.2. React Router 會捕捉 loader throw 出來的 Response，並讓 ErrorPage 透過 useRouteError() 取得
    throw new Response(
      error.response?.data?.errorMessage || // 後端 ExceptionResponseDto 回傳的錯誤訊息 (GlobalExceptionHandler 裡面定義的 handleGlobalException() 會回傳一個 ExceptionResponseDto 物件，裡面有 errorMessage 屬性)
        error.message || // Axios error object 自己的錯誤訊息
        "無法獲取產品資料，請稍後再試。",
      {
        status:
          error.response?.status || // Axios 從後端 HTTP response 讀到的數字 status code
          500,
      },
    );
  }
}

// Response.body → routeError.data
// Response.status → routeError.status
// Response.statusText → routeError.statusText
