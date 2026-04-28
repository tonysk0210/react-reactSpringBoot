import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // 引入 FontAwesomeIcon 組件
import {
  faShoppingCart,
  faNoteSticky,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons"; // 匯入 實際的 icon 定義（資料物件; 有 @ 的 import → 來自「npm 套件（node_modules）」
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom"; // 引入 Link 和 NavLink 組件；
// 這些組件是 React Router 中用於創建導航連結的組件，Link 用於一般的連結，
// 而 NavLink 可以根據當前路由自動添加 active 類，以便進行樣式上的區分。

// import { useContext } from "react"; // 引入 useContext hook；這個 hook 是 React 中用於在函式組件中訪問 Context 的 hook，Context 是 React 中用於在組件樹中傳遞數據的一種方式，可以讓你在組件之間共享數據，而不需要通過 props 一層一層地傳遞。
// import { CartContext } from "../store/cart-context.jsx"; // 引入 CartContext；這個 Context 是用來在組件之間共享購物車狀態的，這樣就不需要通過 props 一層一層地傳遞購物車數據了。

import { useCart } from "../store/cart-context"; // 引入 useCart custom hook；這個 hook 是用來在組件中訪問 CartContext 中的 totalQuantity 屬性，這個屬性表示購物車中商品的總數量，可以用來在購物車圖示旁邊顯示一個徽章，提示用戶購物車中有多少件商品。

// Tailwind CSS 的類，用於設定導航連結在暗模式下的樣式。
const DarkModeClass =
  "text-brand dark:text-light hover:text-dark dark:hover:text-lighter";

// getNavLinkClass 函式用於根據 NavLink 的狀態（是否為當前路由）來動態生成 className 字串，
// 這樣可以讓當前路由的連結有不同的樣式（例如：字體加粗和下劃線）。
// NavLinkRenderProps 有兩個屬性：isActive（布林值，表示當前 NavLink 是否匹配當前路由）和 isPending（布林值，表示當前 NavLink 是否正在匹配過程中）。在這裡，我們只使用了 isActive 來決定是否添加特定的樣式類。
const getNavLinkClass = ({ isActive }) =>
  `navLink ${DarkModeClass} py-2 ${
    isActive ? "underline decoration-2 underline-offset-4 font-bold" : ""
  }`;

export default function Header() {
  // 建立 theme 狀態，初始值從 localStorage 讀取，如果沒有則預設為 "light"
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") === "dark" ? "dark" : "light"; // 從 localStorage 讀取 mode 的值
  });

  const { totalQuantity } = useCart(); // 使用 useCart custom hook 來訪問 CartContext 中的 totalQuantity 屬性，這個屬性表示購物車中商品的總數量，可以用來在購物車圖示旁邊顯示一個徽章，提示用戶購物車中有多少件商品。

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
        <Link to="/" className={`link ${DarkModeClass}`}>
          <FontAwesomeIcon icon={faNoteSticky} className="fa-icon" />
          {/* 使用 React Component：FontAwesomeIcon; 傳入 props：icon={faTags} → 指定要顯示哪個 icon */}
          <span className="brand-title">React 貼紙商城</span>
        </Link>

        {/* navbar 是一個導航欄，包含多個連結，分別導向不同的頁面（"/", "/about", "/contact", "/login", "/cart"） */}
        <nav className="myNav">
          {/* Theme 切換按鈕，點擊後會觸發 toggleTheme 函式來切換主題（暗模式和亮模式） */}
          <div className="py-1.5 mx-3">
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
          </div>

          <ul>
            <li>
              {/* home 導向（"/"） */}
              <NavLink to="/" className={getNavLinkClass}>
                首頁
              </NavLink>
            </li>
            <li>
              {/* about 導向（"/about"） */}
              <NavLink to="/about" className={getNavLinkClass}>
                關於我們
              </NavLink>
            </li>
            <li>
              {/* contact 導向（"/contact"） */}
              <NavLink to="/contact" className={getNavLinkClass}>
                聯絡我們
              </NavLink>
            </li>
            <li>
              {/* login 導向（"/login"） */}
              <NavLink to="/login" className={getNavLinkClass}>
                登入
              </NavLink>
            </li>
            <li>
              {/* cart 導向（"/cart"） */}
              <NavLink
                to="/cart"
                className={`navLink ${DarkModeClass} relative text-brand py-2`}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  size="lg"
                  className="text-brand dark:text-light w-6"
                />
                {/* 使用 FontAwesomeIcon 組件 */}
                <div className="absolute -top-2 -right-6 text-xs bg-yellow-400 text-black font-semibold rounded-full px-2 py-1 leading-none">
                  {totalQuantity}
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
