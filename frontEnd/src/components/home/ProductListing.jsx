import ProductCard from "./ProductCard";

export default function ProductListing({ products }) {
  return (
    <div className="product-listings-container">
      <div className="product-listings-grid">
        {/* 檢查 products 陣列是否有資料 */}
        {products.length > 0 ? (
          products.map(
            // 使用 map 方法來遍歷 products 陣列
            (p) => (
              <ProductCard key={p.productId} product={p} />
              // 為每個產品渲染一個 ProductCard 元件。
              // key 屬性使用 → p.productId，確保每個 ProductCard 都有一個獨特的識別符。
              // key 是給 React 用來追蹤元素的變化，不是給子組件使用的 props，所以不會傳遞給 ProductCard 組件。
            ),
          )
        ) : (
          // 如果 products 陣列是空的，顯示提示訊息
          <p className="product-listings-empty">尚未有產品上架！</p>
        )}
      </div>
    </div>
  );
}
