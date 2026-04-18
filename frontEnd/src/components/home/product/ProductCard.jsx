import Price from "./Price";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
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
    </div>
  );
}
