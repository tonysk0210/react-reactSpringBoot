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
import ProductDetail from "./components/home/product/ProductDetail";
import CheckoutForm from "./components/cart/CheckoutForm";
import ProtectedRoute from "./components/login/ProtectedRoute";

// 從 Home 組件中匯入 productsLoader 函式；這個函式是用來在路由匹配時加載產品資料的，會在 Home 組件中使用 useLoaderData hook來獲取這些資料。
import { productsLoader } from "./components/home/Home";
import { contactAction } from "./components/contact/Contact"; // 從 Contact 組件中匯入 contactAction 函式；這個函式是用來在表單提交時處理表單數據的，會在 Contact 組件中使用 useActionData hook 來獲取這些數據。
import { loginAction } from "./components/login/Login"; // 從 Login 組件中匯入 loginAction 函式；這個函式是用來在表單提交時處理表單數據的，會在 Login 組件中使用 useActionData hook 來獲取這些數據。

// 引入 react-toastify 的 ToastContainer 組件和 Bounce 動畫效果；ToastContainer 是用來顯示 toast 通知的組件，Bounce 是一種動畫效果，可以讓 toast 通知以彈跳的方式出現和消失。
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 引入 react-toastify 的 CSS；這樣才能讓 toast 通知顯示出來並且有樣式

// 引入 CartContext；這個 Context 是用來在組件之間共享購物車狀態的，這樣就不需要通過 props 一層一層地傳遞購物車數據了。
import { CartContext } from "./store/cart-context.jsx";

// 引入 CartProvider；這個組件用於提供購物車上下文的值，這裡我們將 initialCartContext 作為 value 傳入 CartContext.Provider 組件，這樣在整個應用程式中就可以使用 CartContext 來訪問和修改購物車的狀態了。
import { CartProvider } from "./store/cart-context.jsx";
import { AuthProvider } from "./store/auth-context.jsx"; // 引入 AuthProvider；這個組件用於提供認證上下文的值，這裡我們將 initialAuthContext 作為 value 傳入 AuthContext.Provider 組件，這樣在整個應用程式中就可以使用 AuthContext 來訪問和修改認證的狀態了。

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
    <Route path="/login" element={<Login />} action={loginAction} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/products/:productId" element={<CheckoutForm />} />
    {/* 當路由匹配到 "/products/:productId" 時，會渲染 ProductDetail 組件；:productId 是一個動態路由參數，可以在 ProductDetail 組件中使用 useParams hook 來獲取這個參數的值。 */}

    {/* 需要登入才能訪問的路由 */}
    <Route element={<ProtectedRoute />}>
      <Route path="/checkout" element={<CheckoutForm />} />
    </Route>
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

// 定義購物車上下文的初始值，這裡是一個空對象，可以根據需要添加購物車的狀態和方法，例如：items、addItem、removeItem 等等
// const initialCartContext = {
//   cart: [],
//   setCart: () => {},
//   addToCart: () => {
//     console.log("addToCart function is not implemented yet.");
//   },
//   removeFromtCart: () => {},
//   totalQuantity: 0,
// };

createRoot(document.getElementById("root")).render(
  // 使用 StrictMode 包裹 App 組件，呼叫兩次 render 是 React 18 中 StrictMode 的一個特性，
  // 可以幫助開發者更早地發現潛在的問題，例如：不安全的生命週期方法、過時的 API 等等。
  <StrictMode>
    <AuthProvider>
      {/* 使用 CartProvider 組件來包裹 RouterProvider 組件，這樣整個應用程式都能夠使用 CartContext 來訪問和修改購物車的狀態了。 */}
      <CartProvider>
        <RouterProvider router={appRouter} />
        {/* 使用 RouterProvider 組件，將 appRouter 傳入 router 屬性，讓整個應用程式都能夠使用 React Router 的功能 */}
        {/* 這是 CartProvider 的 children，RouterProvider 組件會被渲染在 CartProvider 組件內部，這樣 RouterProvider 就可以訪問到 CartContext 中的值了。*/}
      </CartProvider>
    </AuthProvider>
    <ToastContainer
      // ToastContainer 是用來顯示 toast 通知的組件，這裡配置了一些屬性來定義 toast 通知的行為和樣式，例如：position 定義了通知出現的位置，autoClose 定義了通知自動關閉的時間，theme 定義了通知的主題等等。
      position="top-center"
      autoClose={3000} // autoClose={3000} 表示通知會在 3000 毫秒（也就是 3 秒）後自動關閉
      hideProgressBar={false} // hideProgressBar={false} 表示通知會顯示一個進度條，這個進度條會隨著 autoClose 的時間逐漸減少，直到通知自動關閉
      newestOnTop={false} // newestOnTop={false} 表示新的通知會出現在舊的通知下面，如果設置為 true，則新的通知會出現在舊的通知上面
      draggable // draggable 表示通知可以被拖動，這樣用戶就可以通過拖動來關閉通知或者重新排列通知的位置
      pauseOnHover // pauseOnHover 表示當用戶將鼠標懸停在通知上時，autoClose 的計時會暫停，這樣用戶就有更多的時間來閱讀通知內容；當鼠標離開通知後，autoClose 的計時會繼續，直到通知自動關閉
      theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
      transition={Bounce}
    />
  </StrictMode>,
);
