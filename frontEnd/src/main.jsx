import "./index.css"; // 引入全局 CSS 樣式

// import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 的 CSS；
// 注意：這裡引入的是「整個 Bootstrap 的 CSS」，而不是「Bootstrap 的 React 組件」

// import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 引入 Bootstrap 的 JavaScript；
// 注意：這裡引入的是「整個 Bootstrap 的 JavaScript」，而不是「Bootstrap 的 React 組件」
// 這樣做的目的是為了讓 Bootstrap 的 JavaScript 功能（例如：下拉選單、模態框等）能夠正常運作

// import "./custom.scss"; // 引入 custom.scss；這個檔案裡面有「改變 Bootstrap 預設樣式的 SCSS 變數」

import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom"; // 引入 React Router 的相關函式和組件

// 引入各個頁面的組件；這些組件會在路由匹配時被渲染出來
import Home from "./components/home/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import Login from "./components/login/Login";
import Cart from "./components/cart/Cart";
import ErrorPage from "./components/ErrorPage";

// 從 Home 組件中匯入 productsLoader 函式；這個函式是用來在路由匹配時加載產品資料的，會在 Home 組件中使用 useLoaderData hook來獲取這些資料。
import { productsLoader } from "./components/home/Home";
import { contactAction } from "./components/contact/Contact"; // 從 Contact 組件中匯入 contactAction 函式；這個函式是用來在表單提交時處理表單數據的，會在 Contact 組件中使用 useActionData hook 來獲取這些數據。

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// 定義路由配置；這裡使用 createRoutesFromElements 函式來創建一個路由器，並且定義了路由的結構和對應的組件
const routeDefinitions = createRoutesFromElements(
  <Route path="/" element={<App />} errorElement={<ErrorPage />}>
    {/* 定義一個路由，當路由匹配到 "/" 時，會渲染 App 組件；如果路由匹配失敗，會渲染 ErrorPage 組件 */}
    <Route index element={<Home />} loader={productsLoader} />
    {/* loader={productsLoader} 是 React Router 中用於在路由匹配時加載資料的函式，這個函式會在路由匹配到 "/" 時被調用，用於獲取產品資料，並且在 Home 組件中使用 useLoaderData 鉤子來獲取這些資料。 */}
    <Route path="/home" element={<Home />} loader={productsLoader} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} action={contactAction} />
    {/* action={contactAction} 是 React Router 中用於在表單提交時處理表單數據的函式，這個函式會在 Contact 組件中的 Form 組件提交時被調用，用於處理表單數據，並且在 Contact 組件中使用 useActionData 鉤子來獲取這些數據。 */}
    <Route path="/login" element={<Login />} />
    <Route path="/cart" element={<Cart />} />
  </Route>,
);

const appRouter = createBrowserRouter(routeDefinitions); // 使用 createBrowserRouter 函式來創建一個路由器，並且將 routeDefinitions 傳入作為路由配置

// 定義路由配置；這裡使用 createBrowserRouter 函式來創建一個路由器，並且定義了路由的結構和對應的組件
// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <ErrorPage />, // 當路由匹配失敗時，會渲染 ErrorPage 組件
//     children: [
//       {
//         index: true, // index: true 表示這個路由是父路由的默認子路由，也就是當路由匹配到 "/" 時，會自動渲染 Home 組件
//         element: <Home />,
//       },
//       {
//         path: "/home",
//         element: <Home />,
//       },
//       {
//         path: "/about",
//         element: <About />,
//       },
//       {
//         path: "/contact",
//         element: <Contact />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/cart",
//         element: <Cart />,
//       },
//     ],
//   },
// ]);

createRoot(document.getElementById("root")).render(
  // 使用 StrictMode 包裹 App 組件，呼叫兩次 render 是 React 18 中 StrictMode 的一個特性，
  // 可以幫助開發者更早地發現潛在的問題，例如：不安全的生命週期方法、過時的 API 等等。
  <StrictMode>
    <RouterProvider router={appRouter} />{" "}
    {/* 使用 RouterProvider 組件，將 appRouter 傳入 router 屬性，讓整個應用程式都能夠使用 React Router 的功能 */}
  </StrictMode>,
);
