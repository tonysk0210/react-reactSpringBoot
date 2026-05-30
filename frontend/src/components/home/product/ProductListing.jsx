import ProductCard from "./ProductCard";
import SearchBox from "./SearchBox";
import DropDown from "./DropDown";
import { useState, useMemo } from "react";

// 定義一個名為 sortList 的陣列
const sortList = ["Popularity", "Price: Low to High", "Price: High to Low"];

export default function ProductListing({ products }) {
  // 1. 定義兩個狀態：searchText 用於存儲搜尋框中的文字，sortValue 用於存儲當前選擇的排序方式。
  const [searchText, setSearchText] = useState("");
  const [sortValue, setSortValue] = useState("Popularity");

  // 2. 定義一個名為 filteredAndSortedProducts 的變量。使用 useMemo 來優化性能，只有當 searchText、sortValue 或 products 發生變化時才會重新計算 filteredAndSortedProducts 的值。
  const filteredAndSortedProducts = useMemo(() => {
    // 2-1 先根據 searchText 的值來過濾 products 陣列中的產品。
    const filteredProducts = (products ?? []).filter((p) => {
      // products ?? [] 這個表達式會回傳 products 本身；只有當 products 是 null 或 undefined 時，才會回傳 []。
      return (
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    // 2-2 接著根據 sortValue 的值來對過濾後的產品進行排序。slice() 是用來創建一個新的陣列副本
    return filteredProducts.slice().sort((p1, p2) => {
      // 根據 sortValue 的值來決定排序方式
      switch (sortValue) {
        case "Price: Low to High":
          return p1.price - p2.price; // 代表小到大

        case "Price: High to Low":
          return p2.price - p1.price; // 代表大到小

        default:
          return p2.popularity - p1.popularity; // 代表大到小
      }
    });
  }, [searchText, sortValue, products]); // 這裡的依賴陣列 [searchText, sortValue, products] 表示只有當 searchText、sortValue 或 products 發生變化時，才會重新計算 filteredAndSortedProducts 的值，從而優化性能。

  return (
    <div className="product-listings-container">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12">
        {/* 1. 產品搜尋，傳入相關的 props */}
        <SearchBox
          label="產品搜尋"
          placeholder="Search products..."
          value={searchText}
          setSearchText={setSearchText}
        />

        {/* 2. 產品排序，傳入相關的 props */}
        <DropDown
          label="產品排序"
          options={sortList}
          selectedValue={sortValue}
          setSortValue={setSortValue}
        />
      </div>

      {/* 3. 產品列表區域 */}
      <div className="product-listings-grid">
        {/* 檢查 filteredAndSortedProducts 陣列是否有資料，如果有則渲染 ProductCard 組件，否則顯示提示訊息 */}
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((p) => (
            <ProductCard key={p.id} product={p} /> // key 是給 React 用來追蹤元素的變化，不是給子組件使用的 props，所以不會傳遞給 ProductCard 組件。
          ))
        ) : (
          <p className="product-listings-empty text-brand dark:text-lights">
            未找到符合條件的產品！
          </p>
        )}
      </div>
    </div>
  );
}
