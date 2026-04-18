import "./index.css"; // 引入全局 CSS 樣式

import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 的 CSS；
// 注意：這裡引入的是「整個 Bootstrap 的 CSS」，而不是「Bootstrap 的 React 組件」
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 引入 Bootstrap 的 JavaScript；
// 注意：這裡引入的是「整個 Bootstrap 的 JavaScript」，而不是「Bootstrap 的 React 組件」
// 這樣做的目的是為了讓 Bootstrap 的 JavaScript 功能（例如：下拉選單、模態框等）能夠正常運作

import "./custom.scss"; // 引入 custom.scss；這個檔案裡面有「改變 Bootstrap 預設樣式的 SCSS 變數」

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // 使用 StrictMode 包裹 App 組件，呼叫兩次 render 是 React 18 中 StrictMode 的一個特性，
  // 可以幫助開發者更早地發現潛在的問題，例如：不安全的生命週期方法、過時的 API 等等。
  <StrictMode>
    <App />
  </StrictMode>,
);
