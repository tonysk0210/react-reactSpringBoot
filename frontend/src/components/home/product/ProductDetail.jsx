import { useState, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faShoppingCart,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { useCart } from "../../../store/cart-context"; // 引入 useCart custom hook；這個 hook 是用來在組件中訪問 CartContext 中的 addToCart 方法，這個方法用於將產品添加到購物車中，當用戶點擊「加入購物車」按鈕時，就會調用這個方法，並且將當前的產品作為參數傳入，從而將產品添加到購物車中。
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cart-slice";

export default function ProductDetail() {
  // const params = useParams(); // 從 /products/:productId 取得 productId，例如 /products/123 會得到 params.productId === "123"。

  const location = useLocation();
  const product = location.state?.product; // 從 location.state 中獲取 Link 組件傳遞過來的 product 物件

  const navigate = useNavigate();
  const handleViewCart = () => navigate("/cart"); // 導航到購物車頁面

  const [quantity, setQuantity] = useState(1); // 定義一個狀態來存儲產品的數量，默認值為 1，當用戶在產品詳細頁面中選擇數量時，可以使用 setQuantity 來更新這個狀態，從而在添加到購物車時可以獲取到正確的數量資訊。

  const dispatch = useDispatch(); // 使用 useDispatch hook 來獲取 dispatch 函式，用於分發 action 到 Redux store

  // 這是用來處理「加入購物車」按鈕點擊事件的函式，當用戶點擊「加入購物車」按鈕時，就會調用這個函式，並且將當前的產品和數量作為參數傳入，從而將產品添加到購物車中。
  const handleAddToCart = () => {
    if (quantity < 1) {
      return; // 如果數量小於 1，則不進行任何操作
    }
    dispatch(addToCart({ product, quantity })); // 調用 addToCart 方法，將當前的產品和數量作為參數傳入，從而將產品添加到購物車中。
  };

  // ****** Zooming effect 邏輯 ******
  // 1. 先用 ref 抓到圖片容器
  const zoomRef = useRef(null);

  // 2. 這是用來實現圖片放大效果的 state
  const [backgroundPosition, setBackgroundPosition] = useState("center"); // 決定背景圖現在對準哪個位置。
  const [isHovering, setIsHovering] = useState(false); // 決定圖片是否要放大。

  // 3. 這是用來實現圖片放大效果的事件處理函式
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      zoomRef.current.getBoundingClientRect(); // 取得這個圖片容器在瀏覽器可視畫面中的位置與尺寸。
    const x = ((e.clientX - left) / width) * 100; // 滑鼠在這個 div 裡面的百分比位置
    const y = ((e.clientY - top) / height) * 100; // 滑鼠在這個 div 裡面的百分比位置
    setBackgroundPosition(`${x}% ${y}%`); // 根據鼠標在圖片上的位置來動態設置背景圖片的位置，這樣就可以實現圖片的放大和移動效果，當用戶將鼠標移動到圖片上時，圖片會根據鼠標的位置進行放大和移動，從而讓用戶可以更清晰地查看產品的細節。 決定你「看哪一塊」
  };

  // 4. 這是用來實現圖片放大效果的事件處理函式
  const handleMouseEnter = () => setIsHovering(true); // 當用戶將鼠標移動到產品圖片上時，代表正在懸停

  // 5. 這是用來實現圖片還原效果的事件處理函式
  const handleMouseLeave = () => {
    setIsHovering(false); // 當用戶將鼠標移出產品圖片時，代表不再懸停
    setBackgroundPosition("center"); // 將背景圖片的位置重置為中心
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-6 py-8 font-brand bg-normalbg dark:bg-darkbg">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row md:space-x-8 px-6 p-8">
          {/* 這是用來顯示放大效果的 div 元素 */}
          <div
            ref={zoomRef} // 將這個 div 元素引用到 zoomRef 這個 ref 中
            onMouseMove={isHovering ? handleMouseMove : null} // 若果正在懸停，則當鼠標在圖片上移動時，觸發圖片的放大和移動效果了。
            onMouseEnter={handleMouseEnter} // 當鼠標進入圖片區域時，觸發 handleMouseEnter 函式來設置 isHovering 狀態為 true，這樣就會啟用圖片的放大效果。
            onMouseLeave={handleMouseLeave} // 當鼠標離開圖片區域時，觸發 handleMouseLeave 函式來設置 isHovering 狀態為 false，並將背景圖片的位置重置為中心，這樣就會禁用圖片的放大效果。
            className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden bg-cover"
            style={{
              backgroundImage: `url(${product.imageUrl})`, // 產品圖片網址 透過 db 存取圖片網址 動態設置背景圖片
              backgroundSize: isHovering ? "200%" : "cover", // 進入懸停狀態時，將背景圖片的大小設置為 200%，這樣就會放大圖片；當不在懸停狀態時，將背景圖片的大小設置為 cover，這樣就會保持圖片的原始大小並覆蓋整個容器。
              backgroundPosition: backgroundPosition, // 根據鼠標位置動態設置背景圖片的位置，這樣就可以實現圖片的放大和移動效果，當用戶將鼠標移動到圖片上時，圖片會根據鼠標的位置進行放大和移動，從而讓用戶可以更清晰地查看產品的細節。
            }}
          >
            {/* 實際圖片 */}
            <img
              src={product.imageUrl}
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
              {/* 數量輸入框 */}
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
                  // 當用戶在數量輸入框中輸入數字時，會觸發 onChange 事件，從而調用 setQuantity 函式來更新 quantity 狀態，這樣之後在添加到購物車時就可以獲取到正確的數量資訊了。
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border rounded-md focus:ring focus:ring-light dark:focus:ring-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* 加入購物車 */}
              <button
                // 當用戶點擊「加入購物車」按鈕時，就會調用 handleAddToCart 函式，並且將當前的產品和數量作為參數傳入，從而將產品添加到購物車中。
                onClick={handleAddToCart}
                className="w-full px-4 py-2 bg-brand dark:bg-light text-white dark:text-black rounded-md text-lg font-semibold hover:bg-dark dark:hover:bg-lighter transition"
              >
                加到購物車
                <FontAwesomeIcon icon={faPlus} className="ml-2" />
              </button>

              {/* 查看購物車 */}
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
