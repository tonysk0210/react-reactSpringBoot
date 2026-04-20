import React from "react";
import PageTitle from "../home/PageTitle";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // 引入 useNavigate hook；這個 hook 是 React Router 中用於在組件中進行導航的 hook，當用戶點擊返回商品按鈕時，會使用 useNavigate 來導航到 "/home" 路由，並且可以傳遞一些狀態，例如：username: "madan"，這些狀態可以在目標路由的組件中使用 useLocation hook 來獲取和使用。
import emptyCartImage from "../../assets/util/emptycart.png";

export default function Cart() {
  const navigate = useNavigate(); // 使用 useNavigate hook 來獲取導航函式，這個函式可以用來在組件中進行導航，例如：當用戶點擊返回商品按鈕時，可以使用 navigate("/home") 來導航到 "/home" 路由，並且可以傳遞一些狀態，例如：navigate("/home", { state: { username: "madan" } })，這些狀態可以在目標路由的組件中使用 useLocation hook 來獲取和使用。

  const handleClick = () => {
    navigate("/home", { state: { username: "Anthony" } });
    // option: { replace: true" } 「不要記住現在這一頁」
    // 當用戶點擊返回商品按鈕時，使用 navigate 函式來導航到 "/home" 路由，並且傳遞一個狀態object { username: "madan" }，這些狀態可以在目標路由的組件中使用 useLocation hook 來獲取和使用。
  };

  return (
    <div className="min-h-213 py-12 bg-normalbg dark:bg-darkbg font-brand">
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle title="購物車" />
        <div className="text-center text-gray-600 dark:text-lighter flex flex-col items-center">
          <p className="max-w-xl px-2 mx-auto text-base mb-4">
            喔喔！購物車是空的！繼續購物
          </p>
          <img
            src={emptyCartImage}
            alt="Empty Cart"
            className="max-w-75 mx-auto mb-6 dark:bg-light dark:rounded-md"
          />
          <button
            onClick={handleClick} // 當用戶點擊返回商品按鈕時，會觸發 handleClick 函式，這個函式會使用 navigate 函式來導航到 "/home" 路由，並且傳遞一個狀態object { username: "madan" }，這些狀態可以在目標路由的組件中使用 useLocation hook 來獲取和使用。
            className="py-2 px-4 bg-brand dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
          >
            返回商品
          </button>
        </div>
      </div>
    </div>
  );
}
