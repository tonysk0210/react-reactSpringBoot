import React, { useMemo } from "react";
import PageTitle from "../home/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import emptyCartImage from "../../assets/util/emptycart.png";
import CartTable from "./CartTable"; // 引入 CartTable 組件；這個組件是用來渲染購物車表格的，當購物車不是空的時候，會渲染購物車表格，當購物車是空的時候，會渲染空購物車提示和返回商品按鈕。
import { useAuth } from "../../store/auth-context"; // 引入 useAuth custom hook；這個 hook 是用來在組件中訪問 AuthContext 中的 user 屬性，這個屬性表示當前登入的用戶，可以用來在購物車頁面中顯示用戶的資訊。
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  addToCart,
  removeFromCart,
} from "../../store/cart-slice";

export default function Cart() {
  const navigate = useNavigate(); // useNavigate 與 Link 的差別在可程式化導航且可以傳遞狀態

  const { isAuthenticated, user } = useAuth();

  // 檢查用戶地址是否完整
  const isAddressIncomplete = useMemo(() => {
    if (!isAuthenticated) return false; // 未登入狀態下，不把地址判定為 incomplete & 未登入狀態下，不把地址判定為 incomplete
    if (!user.address) return true; // 有登入，但沒有 address

    const { street, city, state, postalCode, country } = user.address;

    return !street || !city || !state || !postalCode || !country; // 有登入，有 address，但地址不完整，返回 true
  }, [user]); // 使用 useMemo hook 來記住 isAddressIncomplete 的值，這樣在 user 屬性發生變化時，才會重新計算 isAddressIncomplete 的值，這樣可以避免重複計算，提高性能。

  const cart = useSelector(selectCartItems); // 從 Redux store 中獲取購物車中的商品列表

  // 使用 useMemo 來計算購物車是否為空，這樣只有在 cart.length 發生變化時才會重新計算 isCartEmpty 的值，從而提高性能。
  const isCartEmpty = useMemo(() => {
    return cart.length === 0;
  }, [cart.length]);

  // 當用戶點擊返回商品按鈕時，使用 navigate 函式來導航到 "/home" 路由，並且傳遞一個狀態object { source: "useNavigate" }，這些狀態可以在目標路由的組件以及他的子組件中使用 useLocation hook 來獲取和使用。
  const handleClick = () => {
    navigate("/home", { state: { source: "useNavigate" } });
    // navigate(path, options) option: { replace: true" } 「這次導航不要新增一筆瀏覽器歷史紀錄，而是取代目前這一筆 history entry。」
  };

  return (
    <div className="min-h-213 py-12 bg-normalbg dark:bg-darkbg font-brand">
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle title="購物車" />
        {!isCartEmpty ? ( // if 如果購物車不是空的，則渲染購物車表格和結帳按鈕
          <>
            {/* 如果地址不完整，則渲染提示訊息 */}
            {isAddressIncomplete && (
              <p className="text-red-500 text-lg mt-2 text-center">
                請到「個人檔案」更新您的地址以進行結帳。
              </p>
            )}
            {/* 1. 購物車表格 */}
            <CartTable />

            <div className="flex justify-between mt-8 space-x-4">
              {/* 2. 返回商品按鈕 */}
              <Link
                to="/home"
                state={{ source: "Link" }} // 使用 state 屬性將一個狀態 object 傳遞給目標路由，這樣在目標路由的組件以及他的子組件中就可以使用 useLocation hook 來獲取和使用這些狀態了。
                className="py-2 px-4 bg-brand dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
              >
                返回商品
              </Link>
              {/* 3. 結帳按鈕 */}
              <Link
                to={isAddressIncomplete ? "#" : "/checkout"} // 地址不完整時跳轉到當前頁面
                className={`py-2 px-4 text-xl font-semibold rounded-sm flex justify-center items-center transition 
                   text-white dark:text-black ${
                     isAddressIncomplete
                       ? "bg-gray-400 cursor-not-allowed" // 地址不完整時禁用按鈕 所以按鈕會變灰色，滑鼠也會變成禁止符號，但可以按
                       : "bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
                   }`}
                onClick={(e) => {
                  if (isAddressIncomplete) {
                    e.preventDefault(); // 阻止跳轉到結帳頁面 不要跳轉頁面，多加層防止跳轉
                  }
                }}
              >
                結帳
              </Link>
            </div>
          </>
        ) : (
          // else 如果購物車是空的，則渲染空購物車提示和返回商品按鈕
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
              onClick={handleClick} // 觸發 handleClick 函式來導航到 "/home" 路由，並且傳遞一個狀態 object { source: "useNavigate" }
              className="py-2 px-4 bg-brand dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
            >
              返回商品
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
