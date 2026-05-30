// SearchBox 組件是一個可重用的搜尋框組件，接受四個 props：label、placeholder、value 和 setSearchText。
export default function SearchBox({
  label,
  placeholder,
  value,
  setSearchText,
}) {
  return (
    <div className="flex items-center gap-3 pl-4 flex-1 font-brand ">
      <label
        className="text-lg font-semibold text-brand dark:text-light"
        htmlFor="product-search"
      >
        {label}
      </label>
      <input
        id="product-search"
        type="text"
        className="px-4 py-2 text-base border-2 rounded-md transition dark:border-light border-brand dark:text-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800"
        placeholder={placeholder}
        value={value}
        // event.target.value 是 input 元素中當前的值，當使用者在搜尋框中輸入文字時，onChange 事件會被觸發，並將輸入的值傳遞給 setSearchText 函式，以便更新父組件中的搜尋狀態。
        onChange={(event) => setSearchText(event.target.value)}
      />
    </div>
  );
}

/**
SearchBox 的工作流程：

使用者輸入
↓
SearchBox input 觸發 onChange
↓
讀取 event.target.value
↓
直接呼叫從 ProductListing 傳入的 setSearchText(value)
↓
ProductListing 的 searchText state 更新
↓
ProductListing re-render
↓
SearchBox 的 value={searchText} 變成最新值
↓
filteredAndSortedProducts 根據新的 searchText 重新過濾產品

 */
