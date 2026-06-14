/* import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 的 CSS；
// 注意：這裡引入的是「整個 Bootstrap 的 CSS」，而不是「Bootstrap 的 React 組件」

import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 引入 Bootstrap 的 JavaScript；
// 注意：這裡引入的是「整個 Bootstrap 的 JavaScript」，而不是「Bootstrap 的 React 組件」
// 這樣做的目的是為了讓 Bootstrap 的 JavaScript 功能（例如：下拉選單、模態框等）能夠正常運作

import "./custom.scss"; // 引入 custom.scss；這個檔案裡面有「改變 Bootstrap 預設樣式的 SCSS 變數」 */

import "./index.css"; // 引入全局 CSS 樣式，main.jsx 是整個 React app 的入口，這裡引入的 CSS 會在整個 app 載入前先套用

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// 引入 React Router 的相關函式和組件
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// 引入各個頁面的組件
import Home from "./components/home/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import Login from "./components/login/Login";
import Cart from "./components/cart/Cart";
import ErrorPage from "./components/ErrorPage";
import ProductDetail from "./components/home/product/ProductDetail";
import CheckoutForm from "./components/cart/CheckoutForm";
import ProtectedRoute from "./components/login/ProtectedRoute";
import Profile from "./components/login/Profile";
import Orders from "./components/login/Orders";
import OrderManage from "./components/login/admin/OrderManage.jsx";
import Message from "./components/login/admin/Message.jsx";
import Register from "./components/login/Register.jsx";
import OrderSuccess from "./components/cart/OrderSuccess.jsx";

// 引入 loader functions；這些函式是用來在路由匹配時加載數據的，會在對應的組件中使用 useLoaderData hook 來獲取這些數據。
import { productsLoader } from "./components/home/Home";
import { profileLoader } from "./components/login/Profile";
import { ordersLoader } from "./components/login/Orders";
import { orderManageLoader } from "./components/login/admin/OrderManage.jsx";
import { messagesLoader } from "./components/login/admin/Message.jsx";
import { contactLoader } from "./components/contact/Contact";

// 引入 action functions；這些函式是用來在表單提交時處理數據的，會在對應的組件中使用 useActionData hook 來獲取這些數據。
import { contactAction } from "./components/contact/Contact";
import { loginAction } from "./components/login/Login";
import { registerAction } from "./components/login/Register";
import { profileAction } from "./components/login/Profile";

// 引入 react-toastify 的 CSS；這樣才能讓 toast 通知顯示出來並且有樣式
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 引入 AuthProvider；這個組件用於提供認證上下文的值，這裡我們將 initialAuthContext 作為 value 傳入 AuthContext.Provider 組件，這樣在整個應用程式中就可以使用 AuthContext 來訪問和修改認證的狀態了。
import { AuthProvider } from "./store/auth-context.jsx";

// 引入 Stripe 相關組件
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// 引入 Redux store 和 Provider 組件；這樣在整個應用程式中就可以使用 Redux 的功能了。
import store from "./store/store.js"; // 引入 Redux store；這個 store 是用來管理應用程式的全局狀態的，這裡我們將 store 作為 value 傳入 Provider 組件，這樣在整個應用程式中就可以使用 store 來訪問和修改全局狀態了。
import { Provider } from "react-redux"; // 引入 Provider 組件；這個組件是用來提供 Redux store 的，會在 App 組件中使用這個組件來提供 Redux store。

// 初始化 Stripe - public key
const stripePromise = loadStripe(
  "pk_test_51TVvD6FMVB3vMe2eBCgg8DEUVgDD6dvffycHPSCh41qeoDWzY77pDkoRw6KbVqwpxw176v2HyaciVBjYcoqdUtnT00N0NJf4oQ",
);

// ***** 定義路由配置 *****
// 1-1. 把 JSX Route 寫法轉成 route config (整理路由設定)
const routeDefinitions = createRoutesFromElements(
  <Route path="/" element={<App />} errorElement={<ErrorPage />}>
    {/* errorElement : 這個父路由底下如果發生「路由錯誤」，就不要正常渲染 <App />，改渲染 <ErrorPage /> */}
    <Route index element={<Home />} loader={productsLoader} />
    {/* index : 當路由匹配到 "/" 時，會渲染 Home 組件 */}
    <Route path="/home" element={<Home />} loader={productsLoader} />
    <Route path="/about" element={<About />} />
    <Route
      path="/contact"
      element={<Contact />}
      action={contactAction}
      loader={contactLoader}
    />
    <Route path="/login" element={<Login />} action={loginAction} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/products/:productId" element={<ProductDetail />} />
    {/* :productId : 是一個動態路由參數，可以在 ProductDetail 組件中使用 useParams hook 來獲取這個參數的值。 */}
    <Route path="/register" element={<Register />} action={registerAction} />

    {/* 需要登入才能訪問的路由 */}
    <Route element={<ProtectedRoute />}>
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route
        path="/profile"
        element={<Profile />}
        loader={profileLoader}
        action={profileAction}
        // 只有當 actionResult?.success 為 false 時才重新執行 profileLoader - 這樣可以避免成功更新後的不必要的重新執行，造成兩次資料載入
        // actionResult 就是 profileAction() 裡面 return 的東西: { success: false, error: error.response?.data }
        shouldRevalidate={({ actionResult }) => {
          return !actionResult?.success; // 如果 success 為 false，才重新執行 profileLoader (成功更新後就不需要重新執行)
        }}
      />
      <Route path="/orders" element={<Orders />} loader={ordersLoader} />
      <Route
        path="/admin/orderManage"
        element={<OrderManage />}
        loader={orderManageLoader}
      />
      <Route
        path="/admin/messages"
        element={<Message />}
        loader={messagesLoader}
      />
    </Route>
  </Route>,
);

// 1-2. 用 route config 建立真正的 router 物件 (建立會運作的路由器)
const appRouter = createBrowserRouter(routeDefinitions);

// 把 React app 掛載到 index.html 裡 id 為 root 的真實 DOM 節點上「這個 DOM 節點是 React 要管理的根節點。」
createRoot(document.getElementById("root")).render(
  // 使用 StrictMode 包裹 App 組件，呼叫兩次 render 是 React 18 中 StrictMode 的一個特性，
  // 可以幫助開發者更早地發現潛在的問題，例如：不安全的生命週期方法、過時的 API 等等。
  <StrictMode>
    {/* Stripe Provider*/}
    <Elements stripe={stripePromise}>
      <AuthProvider>
        {/* 使用 Provider 包裹 RouterProvider，這樣整個應用程式都能夠使用 Redux 的功能 */}
        <Provider store={store}>
          <RouterProvider router={appRouter} />
        </Provider>
      </AuthProvider>

      {/* ToastContainer 是用來顯示 toast 通知的組件，這裡我們把它放在 App 的外面，這樣不管在哪個頁面都可以顯示 toast 通知了。 */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable
        pauseOnHover
        transition={Bounce}
      />
    </Elements>
  </StrictMode>,
);

/**
 * 
StrictMode 在 development 會故意多做一次 mount/render/effect cycle 來檢查 side effects。

mount
↓
render
↓
commit
↓
effect
↓
cleanup (fake unmount)
↓
render again
↓
commit again
↓
effect again
 */
