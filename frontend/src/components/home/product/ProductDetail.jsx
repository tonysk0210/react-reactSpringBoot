import { useParams, useLocation } from "react-router-dom"; // 從 react-router-dom 庫中引入 useParams 這個 Hook，用於獲取 URL 中的參數。
// useLocation 這個 Hook 用於獲取當前路由的位置信息，包括 pathname、search、hash 和 state 等等，可以用來在組件中獲取導航過程中傳遞的狀態，例如：當用戶從產品列表頁面導航到產品詳細頁面時，可以使用 useLocation 來獲取傳遞過去的產品資料，從而在產品詳細頁面中顯示對應的產品資訊。
import {
  faArrowLeft,
  faShoppingCart,
  faShoppingBasket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

import { useCart } from "../../../store/cart-context"; // 引入 useCart custom hook；這個 hook 是用來在組件中訪問 CartContext 中的 addToCart 方法，這個方法用於將產品添加到購物車中，當用戶點擊「加入購物車」按鈕時，就會調用這個方法，並且將當前的產品作為參數傳入，從而將產品添加到購物車中。

import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cart-slice";

export default function ProductDetail() {
  const params = useParams(); // 使用 useParams Hook 獲取 URL 中的參數，並將其存儲在 params 變量中。這些參數通常是在路由定義中指定的，例如 /products/:id，其中 :id 就是一個參數。
  const location = useLocation(); // 使用 useLocation Hook 獲取當前路由的位置信息，並將其存儲在 location 變量中。這些位置信息包括 pathname、search、hash 和 state 等等，可以用來在組件中獲取導航過程中傳遞的狀態，例如：當用戶從產品列表頁面導航到產品詳細頁面時，可以使用 useLocation 來獲取傳遞過去的產品資料，從而在產品詳細頁面中顯示對應的產品資訊。
  const product = location.state?.product; // 從 location.state 中獲取傳遞過去的產品資料，這些資料是在產品列表頁面中使用 Link 組件導航到產品詳細頁面時傳遞過去的，例如：<Link to={`/products/${product.id}`} state={{ product: product }}>，這樣在產品詳細頁面中就可以使用 location.state.product 來獲取這個產品資料並顯示對應的產品資訊。

  const navigate = useNavigate();
  const handleViewCart = () => navigate("/cart"); // 導航到購物車頁面

  const [quantity, setQuantity] = useState(1); // 定義一個狀態來存儲產品的數量，默認值為 1，當用戶在產品詳細頁面中選擇數量時，可以使用 setQuantity 來更新這個狀態，從而在添加到購物車時可以獲取到正確的數量資訊。

  const zoomRef = useRef(null); // 定義一個 ref 來引用產品圖片的容器元素，這個 ref 可以用來獲取這個元素的位置信息和尺寸，從而在實現圖片放大效果時可以根據鼠標的位置來動態調整背景圖片的位置，讓用戶可以更清晰地查看產品的細節。不會觸發重新渲染，因為 useRef 返回的 ref 物件在整個組件的生命周期內保持不變，當我們修改 ref.current 的值時，不會觸發組件的重新渲染，這樣可以避免不必要的性能開銷，特別是在處理 DOM 元素或第三方庫時非常有用。
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      zoomRef.current.getBoundingClientRect(); // 使用 zoomRef.current.getBoundingClientRect() 來獲取產品圖片容器元素的位置信息和尺寸，這個方法會返回一個包含元素的 left、top、width 和 height 等屬性的物件，這些屬性分別表示元素的左邊距、上邊距、寬度和高度，這些信息可以用來計算鼠標在圖片上的位置，從而動態調整背景圖片的位置，實現圖片放大效果。
    const x = ((e.clientX - left) / width) * 100; // 計算鼠標在圖片上的水平位置，這裡的 e.clientX 是鼠標相對於視口的水平位置，left 是圖片容器元素相對於視口的左邊距，width 是圖片容器元素的寬度，通過這個計算可以得到鼠標在圖片上的水平位置的百分比，從而動態調整背景圖片的位置。
    const y = ((e.clientY - top) / height) * 100; // 計算鼠標在圖片上的垂直位置，這裡的 e.clientY 是鼠標相對於視口的垂直位置，top 是圖片容器元素相對於視口的上邊距，height 是圖片容器元素的高度，通過這個計算可以得到鼠標在圖片上的垂直位置的百分比，從而動態調整背景圖片的位置。
    setBackgroundPosition(`${x}% ${y}%`); // 根據鼠標在圖片上的位置來動態設置背景圖片的位置，這樣就可以實現圖片的放大和移動效果，當用戶將鼠標移動到圖片上時，圖片會根據鼠標的位置進行放大和移動，從而讓用戶可以更清晰地查看產品的細節。 決定你「看哪一塊」
  };

  const handleMouseEnter = () => setIsHovering(true); // 當用戶將鼠標移動到產品圖片上時，代表正在懸停

  const handleMouseLeave = () => {
    setIsHovering(false); // 當用戶將鼠標移出產品圖片時，代表不再懸停
    setBackgroundPosition("center"); // 將背景圖片的位置重置為中心
  };

  const dispatch = useDispatch();
  // 當用戶點擊「加入購物車」按鈕時，就會調用 addToCart 方法，並且將當前的產品作為參數傳入，從而將產品添加到購物車中。
  const handleAddToCart = () => {
    if (quantity < 1) {
      return; // 如果數量小於 1，則不進行任何操作
    }
    dispatch(addToCart({ product, quantity })); // 調用 addToCart 方法，將當前的產品和數量作為參數傳入，從而將產品添加到購物車中。
  };

  return (
    <>
      {/* <div>ProductDetail {params.productId}</div> */}
      {/*  從 URL 中獲取的 productId 參數，這個參數是在路由定義中指定的，例如 /products/:productId，其中 :productId 就是一個參數，當用戶導航到 /products/123 時，params.productId 的值就會是 "123"。 */}

      <div className="min-h-screen flex items-center justify-center px-6 py-8 font-brand bg-normalbg dark:bg-darkbg">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row md:space-x-8 px-6 p-8">
          {/* Product Image with Zoom Effect */}
          <div
            ref={zoomRef} // 將這個 div 元素引用到 zoomRef 這個 ref 中，這樣我們就可以在 handleMouseMove 函式中使用 zoomRef.current 來獲取這個元素的位置信息和尺寸，從而實現圖片放大效果。
            onMouseMove={isHovering ? handleMouseMove : null} // 當鼠標在圖片上移動時，如果正在懸停，則觸發 handleMouseMove 函式來更新背景圖片的位置，從而實現圖片的放大和移動效果，當用戶將鼠標移動到圖片上時，圖片會根據鼠標的位置進行放大和移動，從而讓用戶可以更清晰地查看產品的細節。
            onMouseEnter={handleMouseEnter} // 當鼠標進入圖片區域時，觸發 handleMouseEnter 函式來設置 isHovering 狀態為 true，這樣就會啟用圖片的放大效果。
            onMouseLeave={handleMouseLeave} // 當鼠標離開圖片區域時，觸發 handleMouseLeave 函式來設置 isHovering 狀態為 false，並將背景圖片的位置重置為中心，這樣就會禁用圖片的放大效果。
            className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden bg-cover"
            style={{
              backgroundImage: `url(${product.imageUrl})`, // 產品圖片網址 透過 db 存取圖片網址 動態設置背景圖片
              backgroundSize: isHovering ? "200%" : "cover", // 根據是否正在懸停來動態設置背景圖片的大小，如果正在懸停，則將背景圖片放大到 200%，否則保持原始大小（cover）
              backgroundPosition: backgroundPosition, // 根據鼠標位置動態設置背景圖片的位置，這樣就可以實現圖片的放大和移動效果，當用戶將鼠標移動到圖片上時，圖片會根據鼠標的位置進行放大和移動，從而讓用戶可以更清晰地查看產品的細節。
            }}
          >
            <img
              src={product.imageUrl} // 產品圖片網址 透過 db 存取圖片網址
              alt={product.name}
              className="w-full h-full opacity-0" // 使用 opacity-0 來隱藏 img 元素，因為我們已經使用 backgroundImage 來顯示產品圖片了，這樣可以避免圖片重複顯示，同時也能保留 img 元素的語義和可訪問性，例如：當使用屏幕閱讀器時，仍然可以讀取到產品圖片的 alt 屬性。撐大容器高度，讓背景圖片有足夠的空間顯示放大效果。
            />
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6 mt-8 md:mt-0">
            <Link
              to="/home"
              className="inline-flex self-start items-center text-brand dark:text-light font-medium hover:text-dark dark:hover:text-lighter"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              返回商品列表
            </Link>

            <div>
              <h1 className="text-3xl font-extrabold text-brand dark:text-light mb-4">
                {product.name} {/* 產品名稱 */}
              </h1>
              <p className="text-lg text-dark dark:text-lighter mb-4">
                {product.description} {/* 產品描述 */}
              </p>
              <div className="text-2xl font-bold text-brand dark:text-light">
                ${Number(product.price).toFixed(2)} {/* 產品價格 */}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {/* Quantity Input */}
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="quantity"
                  className="text-brand dark:text-light"
                >
                  數量:
                </label>
                <input
                  type="number" // 數字輸入框
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} // 當用戶在數量輸入框中輸入數字時，會觸發 onChange 事件，這個事件會調用 setQuantity 函式來更新 quantity 狀態，parseInt(e.target.value) 用於將輸入的值轉換為整數，如果輸入的值無法轉換為數字（例如：空字符串），則使用 || 1 來默認為 1，這樣可以確保 quantity 的值始終是一個有效的數字。
                  className="w-16 px-2 py-1 border rounded-md focus:ring focus:ring-light dark:focus:ring-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart} // 當用戶點擊「加入購物車」按鈕時，就會調用 handleAddToCart 函式，並且將當前的產品和數量作為參數傳入，從而將產品添加到購物車中。
                className="w-full px-4 py-2 bg-brand dark:bg-light text-white dark:text-black rounded-md text-lg font-semibold hover:bg-dark dark:hover:bg-lighter transition"
              >
                加到購物車
                <FontAwesomeIcon icon={faPlus} className="ml-2" />
              </button>

              {/* View Cart Button */}
              <button
                onClick={handleViewCart}
                className="w-full px-4 py-2 bg-brand dark:bg-light text-white dark:text-black rounded-md text-lg font-semibold hover:bg-dark dark:hover:bg-lighter transition"
              >
                我的購物車
                <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
