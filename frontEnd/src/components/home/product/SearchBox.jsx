import React from "react";

// SearchBox 組件是一個簡單的搜尋框，包含一個標籤和一個輸入框。
export default function SearchBox({ label, placeholder, value, handleSearch }) {
  return (
    <div className="flex items-center gap-3 pl-4 flex-1 font-brand">
      <label className="text-lg font-semibold text-brand">{label}</label>
      <input
        type="text"
        className="px-4 py-2 text-base border-2 rounded-md transition border-brand focus:ring focus:ring-dark focus:outline-none text-gray-800"
        placeholder={placeholder}
        value={value}
        // onChange 事件會在使用者輸入文字時觸發，並將輸入的值傳遞給 handleSearch 函式，以便更新父組件中的搜尋狀態。
        onChange={(event) => handleSearch(event.target.value)}
      />
    </div>
  );
}
