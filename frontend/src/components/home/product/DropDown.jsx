import React from "react";

export default function DropDown({
  label,
  options,
  selectedValue,
  handleSort,
}) {
  return (
    <div className="flex items-center gap-2 justify-end pr-12 flex-1 font-brand">
      <label className="text-lg font-semibold dark:text-light text-brand">
        {label}
      </label>
      <select
        className="px-3 py-2 text-base border-2 rounded-md transition dark:border-light border-brand focus:ring dark:focus:ring-light focus:ring-dark focus:outline-none dark:text-gray-500 text-gray-900"
        value={selectedValue}
        // onChange 事件會在使用者選擇不同選項時觸發，並將選擇的值傳遞給 handleSort 函式，以便更新父組件中的排序狀態。
        onChange={(event) => handleSort(event.target.value)}
      >
        {/* options 是一個傳入的 prop 陣列，裡面包含了所有的選項值。map 函式會遍歷這個陣列，對每個選項值產生一個 <option> 元素。 
            map 的第二個參數 index 是當前元素在陣列中的索引，這裡用它來作為 key 的值，確保每個 <option> 元素都有一個獨特的識別符*/}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
