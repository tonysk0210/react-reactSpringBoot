import Price from "./Price";
import { Link } from "react-router-dom";
// import { useContext } from "react"; // 引入 useContext hook；這個 hook 是 React 中用於在函式組件中訪問 Context 的 hook，Context 是 React 中用於在組件樹中傳遞數據的一種方式，可以讓你在組件之間共享數據，而不需要通過 props 一層一層地傳遞。
// import { CartContext } from "../../../store/cart-context"; // 引入 CartContext；這個 Context 是用來在組件之間共享購物車狀態的，這樣就不需要通過 props 一層一層地傳遞購物車數據了。

import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cart-slice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  return (
    <div className="product-card">
      {/* 點擊產品卡片會導航到 /products/:id 路由，這裡的 :id 是一個動態參數，會被替換成實際的產品 ID，例如：/products/123，這樣在 ProductDetail 組件中就可以使用 useParams 來獲取這個 ID 並顯示對應的產品詳細資訊。 */}
      <Link
        to={`/products/${product.id}`}
        state={{ product: product }} // 使用 state 屬性將整個 product 物件傳遞給目標路由，這樣在 ProductDetail 組件中就可以使用 useLocation 來獲取這個 product 物件並顯示對應的產品詳細資訊。
        // useNavigate 也可以傳遞 state，但 Link 組件更適合用於導航到其他頁面並且傳遞狀態，而 useNavigate 更適合用於在事件處理函數中進行導航，例如：在按鈕點擊事件中使用 useNavigate 來導航到其他頁面。這裡使用 Link 組件來實現產品卡片的導航功能，當用戶點擊產品卡片時，就會導航到對應的產品詳細頁面，並且將產品資料傳遞過去。
        // 這裡唯有透過Link將產品資料傳遞過去，才能在 ProductDetail 組件中使用 useLocation 來獲取這些資料並顯示出來；如果直接在 ProductDetail 組件中使用 useParams 來獲取產品 ID，然後再從後端 API 獲取產品資料，這樣就會增加一次額外的 API 請求，降低性能；而且如果產品資料已經在 Home 組件中獲取到了，直接傳遞過去就可以避免重複獲取，提高效率。
        className="product-card-image-container"
      >
        {/* 產品圖片 */}
        <img
          src={product.imageUrl} // 產品圖片網址 透過 db 存取圖片網址
          alt={product.name} // 產品名稱
          className="product-card-image"
        />
      </Link>
      {/* 產品詳細資訊 */}
      <div className="product-card-details">
        <h2 className="product-card-title">{product.name}</h2>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer ">
          <div className="product-card-price self-end">
            <Price currency="$ " price={product.price} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm text-brand bg-lighter px-3 py-1 rounded-full">
              Popularity: {product.popularity}
            </div>
            <button
              type="button"
              onClick={() => dispatch(addToCart({ product, quantity: 1 }))} // 當用戶點擊「加入購物車」按鈕時，就會調用 addToCart 方法，並且將當前的產品作為參數傳入，從而將產品添加到購物車中。
              className="text-sm font-semibold text-white bg-brand hover:bg-dark px-4 py-2 rounded-md transition"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
