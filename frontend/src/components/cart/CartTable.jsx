import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  addToCart,
  removeFromCart,
  clearCart,
} from "../../store/cart-slice";

export default function CartTable() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);

  // 計算購物車中商品的總價
  const subtotal = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0) // 使用 reduce 方法來計算購物車中商品的總價，acc 是累加器，item 是當前商品，0 是初始值。
    .toFixed(2); // 使用 toFixed 方法來將總價格式化為兩位小數。

  // 更新購物車中某個商品的數量
  const updateCartQuantity = (productId, quantity) => {
    const product = cart.find((item) => item.id === productId); // 使用 find 方法來找到購物車中商品的列表，productId 是商品的 id，quantity 是商品的數量。
    dispatch(
      addToCart({ product, quantity: quantity - (product?.quantity || 0) }), // minus 的原因是：把使用者輸入的新數量，轉成 Redux reducer 需要的「增加或減少多少」。 新數量 - 舊數量 = 增加或減少多少。
    );
  };

  // 清空購物車
  const clearCartHandler = () => {
    dispatch(clearCart());
  };

  return (
    <div className="min-h-80 max-w-4xl mx-auto my-8 w-full font-brand">
      <table className="w-full table-fixed">
        {/* 表格標題 */}
        <thead>
          <tr className="uppercase text-sm text-brand dark:text-light border-b border-brand dark:border-light">
            <th className="px-6 py-4 text-2xl">產品</th>
            <th className="px-6 py-4 text-2xl">數量</th>
            <th className="px-6 py-4 text-2xl">價格</th>
            <th className="px-6 py-4 text-2xl">移除</th>
          </tr>
        </thead>
        {/* 表格內容 */}
        <tbody className="divide-y divide-brand dark:divide-light">
          {cart.map(
            (
              item, // 使用 map 方法來遍歷購物車中商品的列表，item 是當前商品。
            ) => (
              <tr
                key={item.id} // 使用 key 屬性來標識每個商品
                className="text-sm sm:text-base text-brand dark:text-light text-center"
              >
                {/* 產品名稱和圖片 */}
                <td className="px-4 sm:px-6 py-4">
                  <Link
                    to={`/products/${item.id}`}
                    state={{ product: item }} // 使用 state 屬性將整個 item 物件傳遞給目標路由，這樣在 ProductDetail 組件中就可以使用 useLocation 來獲取這個 item 物件並顯示對應的產品詳細資訊。
                    className="flex items-center"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover mr-4 hover:scale-110 transition-transform"
                    />
                    <span className="text-brand dark:text-light hover:underline">
                      {item.name}
                    </span>
                  </Link>
                </td>
                {/* 數量 */}
                <td className="px-4 sm:px-6 py-4">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartQuantity(
                        item.id,
                        parseInt(e.target.value, 10) || 1, // 把 input 裡的文字轉成 10 進位整數；如果轉不出有效數字，就用 1
                      )
                    }
                    className="w-16 px-2 py-1 border rounded-md focus:ring focus:ring-light dark:focus:ring-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </td>
                {/* 單價 */}
                <td className="px-4 sm:px-6 py-4 text-base font-light">
                  ${item.price.toFixed(2)}
                </td>
                {/* 刪除按鈕 */}
                <td className="px-4 sm:px-6 py-4">
                  <button
                    aria-label="delete-item"
                    onClick={() => dispatch(removeFromCart({ id: item.id }))}
                    className="text-red-400 border border-red-400 p-2 rounded hover:bg-lighter dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </td>
              </tr>
            ),
          )}
          {/* 小計 */}
          {cart.length > 0 && (
            <tr className="text-center">
              <td></td>
              <td className="text-base text-gray-600 dark:text-gray-300 font-semibold uppercase px-4 sm:px-6 py-4">
                Subtotal
              </td>
              <td className="text-lg text-brand dark:text-blue-400 font-medium px-4 sm:px-6 py-4">
                ${subtotal}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
