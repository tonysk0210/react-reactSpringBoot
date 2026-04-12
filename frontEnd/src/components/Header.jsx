import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // 引入 FontAwesomeIcon 組件
import {
  faShoppingCart,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons"; // 匯入 實際的 icon 定義（資料物件; 有 @ 的 import → 來自「npm 套件（node_modules）」

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        {/* logo 是一個連結，點擊後會導向首頁（"/"） */}
        <a href="/" className="link">
          <FontAwesomeIcon icon={faNoteSticky} className="fa-icon" />
          {/* 使用 React Component：FontAwesomeIcon; 傳入 props：icon={faTags} → 指定要顯示哪個 icon */}
          <span className="brand-title">React 貼紙商城</span>
        </a>

        {/* navbar 是一個導航欄，包含多個連結，分別導向不同的頁面（"/", "/about", "/contact", "/login", "/cart"） */}
        <nav className="myNav">
          <ul>
            <li>
              {/* home 導向（"/"） */}
              <a href="/" className="navLink">
                首頁
              </a>
            </li>
            <li>
              {/* about 導向（"/about"） */}
              <a href="/about" className="navLink">
                關於我們
              </a>
            </li>
            <li>
              {/* contact 導向（"/contact"） */}
              <a href="/contact" className="navLink">
                聯絡我們
              </a>
            </li>
            <li>
              {/* login 導向（"/login"） */}
              <a href="/login" className="navLink">
                登入
              </a>
            </li>
            <li>
              {/* cart 導向（"/cart"） */}
              <a href="/cart" className="navLink">
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
