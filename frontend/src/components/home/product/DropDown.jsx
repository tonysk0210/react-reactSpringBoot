// DropDown 組件是一個可重用的下拉選單組件，接受四個 props：label、options、selectedValue 和 setSortValue。
export default function DropDown({
  label,
  options,
  selectedValue,
  setSortValue,
}) {
  return (
    <div className="flex items-center gap-2 justify-end pr-12 flex-1 font-brand">
      <label className="text-lg font-semibold dark:text-light text-brand">
        {label}
      </label>
      <select
        className="px-3 py-2 text-base border-2 rounded-md transition dark:border-light border-brand focus:ring dark:focus:ring-light focus:ring-dark focus:outline-none dark:text-gray-500 text-gray-900"
        value={selectedValue}
        // event.target.value 是 select 元素中當前選擇的值，當使用者選擇不同的選項時，onChange 事件會被觸發，並將選擇的值傳遞給 setSortValue 函式，以便更新父組件中的排序狀態。
        onChange={(event) => setSortValue(event.target.value)}
      >
        {/* options 是一個包含所有選項值的陣列，index 是當前元素在陣列中的索引*/}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
