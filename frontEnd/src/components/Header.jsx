import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // 引入 FontAwesomeIcon 組件
import {
  faShoppingCart,
  faNoteSticky,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons"; // 匯入 實際的 icon 定義（資料物件; 有 @ 的 import → 來自「npm 套件（node_modules）」
import { useState, useEffect } from "react";

// Tailwind CSS 的類，用於設定導航連結在暗模式下的樣式。
const DarkModeClass =
  "text-brand dark:text-light hover:text-dark dark:hover:text-lighter";

export default function Header() {
  // 建立 theme 狀態，初始值從 localStorage 讀取，如果沒有則預設為 "light"
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") === "dark" ? "dark" : "light"; // 從 localStorage 讀取 mode 的值
  });

  // toggleMode 函式用於切換主題模式（暗模式和亮模式）。當用戶點擊切換按鈕時，這個函式會被觸發，根據當前的 mode 狀態來切換到另一個模式，並將新的模式存儲到 localStorage 中，以便在頁面重新載入後保持用戶的選擇。
  const toggleMode = () => {
    setMode((prevMode) => {
      // 使用 setMode 更新 mode 狀態，prevMode 是當前的 mode 狀態
      const newMode = prevMode === "light" ? "dark" : "light"; // 根據當前模式切換到另一個模式
      localStorage.setItem("mode", newMode); // 將新的模式存儲到 localStorage 中
      return newMode; // 更新狀態為新的模式
    });
  };

  // 監聽 theme 狀態的變化，當 theme 改變時更新 document.documentElement 的 class 列表，以切換主題樣式。
  // 當第一次渲染組件時，useEffect 會檢查 mode 的值，如果是 "dark"，就會在 <html> 元素上添加 "dark" 類，這樣 Tailwind CSS 的暗模式樣式就會生效；如果 mode 是 "light"，則會移除 "dark" 類。
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark"); // 如果 theme 是 "dark"，就添加 "dark" 類到 <html> 元素，這樣 Tailwind CSS 的 dark 模式樣式就會生效
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]); //「只要 mode 改變，就重新執行這段 effect。」

  return (
    <header className="header border-gray-300 dark:border-gray-600 bg-normalbg dark:bg-darkbg">
      <div className="container">
        {/* logo 是一個連結，點擊後會導向首頁（"/"） */}
        <a href="/" className={`link ${DarkModeClass}`}>
          <FontAwesomeIcon icon={faNoteSticky} className="fa-icon" />
          {/* 使用 React Component：FontAwesomeIcon; 傳入 props：icon={faTags} → 指定要顯示哪個 icon */}
          <span className="brand-title">React 貼紙商城</span>
        </a>

        {/* navbar 是一個導航欄，包含多個連結，分別導向不同的頁面（"/", "/about", "/contact", "/login", "/cart"） */}
        <nav className="myNav">
          {/* Theme 切換按鈕，點擊後會觸發 toggleTheme 函式來切換主題（暗模式和亮模式） */}
          <button
            className="flex items-center justify-center mx-3 w-7 h-7 rounded-full border border-brand dark:border-light transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle theme"
            onClick={toggleMode} // 帶入切換主題的函式
          >
            <FontAwesomeIcon
              icon={mode === "light" ? faSun : faMoon} // 根據 mode 的 state 來決定顯示月亮圖示（暗模式）還是太陽圖示（亮模式）
              className="w-4 h-4 dark:text-light text-brand"
            />
          </button>

          <ul>
            <li>
              {/* home 導向（"/"） */}
              <a href="/" className={`navLink ${DarkModeClass}`}>
                首頁
              </a>
            </li>
            <li>
              {/* about 導向（"/about"） */}
              <a href="/about" className={`navLink ${DarkModeClass}`}>
                關於我們
              </a>
            </li>
            <li>
              {/* contact 導向（"/contact"） */}
              <a href="/contact" className={`navLink ${DarkModeClass}`}>
                聯絡我們
              </a>
            </li>
            <li>
              {/* login 導向（"/login"） */}
              <a href="/login" className={`navLink ${DarkModeClass}`}>
                登入
              </a>
            </li>
            <li>
              {/* cart 導向（"/cart"） */}
              <a href="/cart" className={`navLink ${DarkModeClass}`}>
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                {/* 使用 FontAwesomeIcon 組件 */}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
