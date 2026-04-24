import Price from "./Price";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      state={{ product: product }} // 使用 state 屬性將整個 product 物件傳遞給目標路由，這樣在 ProductDetail 組件中就可以使用 useLocation 來獲取這個 product 物件並顯示對應的產品詳細資訊。
      // useNavigate 也可以傳遞 state，但 Link 組件更適合用於導航到其他頁面並且傳遞狀態，而 useNavigate 更適合用於在事件處理函數中進行導航，例如：在按鈕點擊事件中使用 useNavigate 來導航到其他頁面。這裡使用 Link 組件來實現產品卡片的導航功能，當用戶點擊產品卡片時，就會導航到對應的產品詳細頁面，並且將產品資料傳遞過去。 */}
      className="product-card"
    >
      {/* 點擊產品卡片會導航到 /products/:id 路由，這裡的 :id 是一個動態參數，會被替換成實際的產品 ID，例如：/products/123，這樣在 ProductDetail 組件中就可以使用 useParams 來獲取這個 ID 並顯示對應的產品詳細資訊。 */}
      <div className="product-card-image-container">
        {/* 產品圖片 */}
        <img
          src={product.imageUrl} // 產品圖片網址 透過 db 存取圖片網址
          alt={product.name} // 產品名稱
          className="product-card-image"
        />
      </div>

      {/* 產品詳細資訊 */}
      <div className="product-card-details">
        <h2 className="product-card-title">{product.name}</h2>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer">
          <div className="product-card-price">
            <Price currency="$ " price={product.price} />
          </div>
          <div className="text-sm text-brand bg-lighter px-3 py-1 rounded-full">
            Popularity: {product.popularity}
          </div>
        </div>
      </div>
    </Link>
  );
}
