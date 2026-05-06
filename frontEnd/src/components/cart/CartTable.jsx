import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../store/cart-context";

export default function CartTable() {
  const { cart, addToCart, removeFromCart } = useCart(); // 使用 useCart hook 來獲取 CartContext 中的 cart 屬性，這個屬性表示購物車中商品的列表，可以用來在購物車頁面中顯示購物車中的商品列表。

  // 計算購物車中商品的總價
  const subtotal = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0) // 使用 reduce 方法來計算購物車中商品的總價，acc 是累加器，item 是當前商品，0 是初始值。
    .toFixed(2); // 使用 toFixed 方法來將總價格式化為兩位小數。

  // 更新購物車中商品的數量
  const updateCartQuantity = (productId, quantity) => {
    const product = cart.find((item) => item.productId === productId); // 使用 find 方法來找到購物車中商品的列表，productId 是商品的 id，quantity 是商品的數量。
    addToCart(product, quantity - (product?.quantity || 0)); // 使用 addToCart 方法來更新購物車中商品的數量，product 是商品，quantity 是商品的數量。
  };

  return (
    <div className="min-h-80 max-w-4xl mx-auto my-8 w-full font-brand">
      <table className="w-full">
        {/* 表格標題 */}
        <thead>
          <tr className="uppercase text-sm text-brand dark:text-light border-b border-brand dark:border-light">
            {/* 表格標題的文字大小 */}
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
                key={item.productId} // 使用 key 屬性來標識每個商品，這樣就可以確保每個商品都有唯一的標識符，從而避免重複渲染的問題。
                className="text-sm sm:text-base text-brand dark:text-light text-center"
              >
                {/* 產品名稱和圖片 */}
                <td className="px-4 sm:px-6 py-4 flex items-center">
                  <Link
                    to={`/products/${item.productId}`}
                    state={{ product: item }}
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
                        item.productId,
                        parseInt(e.target.value, 10) || 1,
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
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-400 border border-red-400 p-2 rounded hover:bg-lighter dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </td>
              </tr>
            ),
          )}
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
