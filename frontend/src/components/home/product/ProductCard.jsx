import Price from "./Price";
import { Link } from "react-router-dom";

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
        // useNavigate 也可以傳遞 state，但 Link 組件更適合用於導航到其他頁面並且傳遞狀態
        className="product-card-image-container"
      >
        {/* 產品圖片 */}
        <img
          src={product.imageUrl} // 載入產品圖片
          alt={product.name}
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
