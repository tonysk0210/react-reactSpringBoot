import ProductCard from "./ProductCard";
import SearchBox from "./SearchBox";
import DropDown from "./DropDown";
import { useState, useMemo } from "react"; // 從 React 庫中引入 useState 和 useMemo 這兩個 Hook，分別用於管理狀態和優化性能。

const sortList = ["Popularity", "Price: Low to High", "Price: High to Low"];

export default function ProductListing({ products }) {
  // 1.2 定義一個名為 searchText 的狀態變量，初始值為空字串。這個變量將用來存儲使用者在搜尋框中輸入的文字。
  const [searchText, setSearchText] = useState("");
  // 2.2 定義一個名為 sortValue 的狀態變量，初始值為 undefined。這個變量將用來存儲使用者在排序下拉選單中選擇的排序方式。
  const [sortValue, setSortValue] = useState("Popularity");

  // 1.1 定義一個函式 handleSearchChange
  function handleSearchChange(targetValue) {
    setSearchText(targetValue); // 這個函式會在使用者在搜尋框中輸入文字時被呼叫，並將輸入的文字傳遞給 setSearchText 函式，以更新 searchText 狀態。
    // console.log("搜尋文字:", searchText); // searchText 的值會在下一次 render 後更新，所以這裡的 console.log 會顯示上一個輸入的值，而不是當前輸入的值。
  }

  // 2.1 定義一個函式 handleSortChange
  function handleSortChange(targetValue) {
    setSortValue(targetValue);
    // console.log("排序方式:", targetValue);
  }

  // 3. 定義一個名為 filteredAndSortedProducts 的變量，這個變量會根據 searchText 和 sortValue 的值來過濾和排序 products 陣列中的產品。
  // 使用 useMemo 來優化性能，只有當 searchText、sortValue 或 products 發生變化時，才會重新計算 filteredAndSortedProducts 的值。
  const filteredAndSortedProducts = useMemo(() => {
    // 1.3 定義一個名為 filteredProducts 的變量，這個變量會根據 searchText 的值來過濾 products 陣列中的產品。
    const filteredProducts = (products ?? []).filter((p) => {
      // 這裡的 products ?? [] 是一個 Nullish Coalescing Operator（空值合併運算符），它的作用是當 products 為 null 或 undefined 時，
      // 使用一個空陣列 [] 作為預設值，確保後續的 filter 方法不會因為 products 是 null 或 undefined 而拋出錯誤。
      // filter 方法會遍歷 products 陣列中的每個產品 p，並檢查產品的名稱（p.name）或描述（p.description）是否包含 searchText 中的文字。
      return (
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    // 2.3 定義一個名為 sortedProducts 的變量，這個變量會根據 sortValue 的值來對 filteredProducts 陣列中的產品進行排序。
    // slice() 方法會創建一個新的陣列(shallow copy)，這樣就不會修改原來的 filteredProducts 陣列。sort() 方法會根據 sortValue 的值來決定排序方式。
    return filteredProducts.slice().sort((a, b) => {
      // 根據 sortValue 的值來決定排序方式，使用 switch 語句來處理不同的排序選項。
      switch (sortValue) {
        case "Price: Low to High":
          // parseFloat 是一個 JavaScript 的內建函式，用於將字串解析為浮點數。
          // 這裡的 a.price 和 b.price 是產品的價格。使用 parseFloat 可以確保在進行數值比較時，將價格轉換為數字類型。
          return a.price - b.price;
        case "Price: High to Low":
          return b.price - a.price;
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [searchText, sortValue, products]); // 這裡的依賴陣列 [searchText, sortValue, products] 告訴 useMemo 只有當這三個變量中的任意一個發生變化時，才會重新計算 filteredAndSortedProducts 的值。

  return (
    <div className="product-listings-container">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12">
        {/* 1. 載入 SearchBox 組件，並傳遞相關的 props，包括 label、placeholder、value 和 handleSearch。 */}
        <SearchBox
          label="動態搜尋"
          placeholder="Search products..."
          value={searchText}
          handleSearch={(targetValue) => handleSearchChange(targetValue)}
          // 這裡的 handleSearchChange 是一個函式，當使用者在搜尋框中輸入文字時會被呼叫，並將輸入的值傳遞給它，以便更新父組件中的搜尋狀態。
        />

        {/* 2. 載入 DropDown 組件，並傳遞相關的 props，包括 label、options、selectedValue 和 handleSort。 */}
        <DropDown
          label="動態排序"
          options={sortList}
          selectedValue={sortValue}
          handleSort={(targetValue) => handleSortChange(targetValue)}
          // 這裡的 handleSortChange 也是一個函式，當使用者選擇不同的排序選項時會被呼叫
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
            尚未有產品上架！
          </p>
        )}
      </div>
    </div>
  );
}
