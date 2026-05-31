import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faNoteSticky,
  faSun,
  faMoon,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// import { useContext } from "react"; // 引入 useContext hook；這個 hook 是 React 中用於在函式組件中訪問 Context 的 hook，Context 是 React 中用於在組件樹中傳遞數據的一種方式，可以讓你在組件之間共享數據，而不需要通過 props 一層一層地傳遞。
// import { CartContext } from "../store/cart-context.jsx"; // 引入 CartContext；這個 Context 是用來在組件之間共享購物車狀態的，這樣就不需要通過 props 一層一層地傳遞購物車數據了。

import { useAuth } from "../store/auth-context"; // 引入 useAuth custom hook；這個 hook 是用來在組件中訪問 AuthContext 中的 user 屬性，這個屬性表示當前登入的用戶，可以用來在導航欄中顯示用戶名稱和登出按鈕。

import { useSelector } from "react-redux"; // 引入 useSelector hook；這個 hook 是 React Redux 中用於在組件中訪問 Redux store 中的 state 的 hook，可以用來在組件中讀取 store 中的數據。
import { selectTotalQuantity } from "../store/cart-slice"; // 引入 selectTotalQuantity 選擇器函式；這個函式是用來從 Redux store 中選擇購物車的總數量，可以用來在購物車圖示旁邊顯示一個徽章，提示用戶購物車中有多少件商品。

// Tailwind CSS 的類，用於設定導航連結在暗模式下的 className 樣式。
const DarkModeClass =
  "text-brand dark:text-light hover:text-dark dark:hover:text-lighter";
const dropdownLinkClass =
  "block w-full text-left px-4 py-2 text-lg font-brand font-semibold text-brand dark:text-light hover:bg-gray-100 dark:hover:bg-gray-600";
const menuClass =
  "text-center text-lg font-brand font-semibold text-brand py-2 hover:text-dark";

// NavLink 的 className 可以傳入函式，這個函式會接收一個物件，裡面有一個屬性 isActive用來判斷是否加上目前頁面的樣式。
const getNavLinkClass = ({ isActive }) =>
  `navLink ${DarkModeClass} py-2 ${
    isActive ? "underline decoration-2 underline-offset-4 font-bold" : ""
  }`;

export default function Header() {
  // 1. 定義一個狀態來存儲主題模式（暗模式或亮模式），初始值從 localStorage 讀取
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") === "dark" ? "dark" : "light";
  });

  // 1-1. 切換 mode 的值並將新的值存儲到 localStorage 中
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("mode", newMode);
    setMode(newMode);
  };

  // 用戶菜單狀態
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  // 管理員菜單狀態
  const [isAdminMenuOpen, setAdminMenuOpen] = useState(false);
  // 獲取當前路由位置 告訴我們現在在哪个頁面(tells you where the app currently is in the router)
  const location = useLocation();
  const userMenuRef = useRef(null); // userMenuRef 用於存儲用戶菜單的 DOM 元素，以便在點擊外部時關閉菜單
  const navigate = useNavigate(); // navigate 用於程式化導航

  const totalQuantity = useSelector(selectTotalQuantity); // 從 Redux store 中選擇購物車的總數量
  const { isAuthenticated, logout, user } = useAuth(); // 從 useAuth 鉤子取得認證狀態、登出函式和用戶資訊

  // 是否為管理員
  const isAdmin = user?.role?.includes("ROLE_ADMIN"); // 從 user 物件中取得 role 屬性，並檢查是否包含 "ROLE_ADMIN"

  // 切換管理員菜單
  const toggleAdminMenu = () => {
    setAdminMenuOpen(!isAdminMenuOpen);
  };
  // 切換用戶菜單
  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };

  // 登出處理
  const handleLogout = () => {
    // e.preventDefault(); // 阻止 Link 立即執行預設導航
    logout();
    toast.success("成功登出!");
    navigate("/home");
  };

  // 使用 useEffect 來監聽 mode 和 location.pathname 的變化，當這些值改變時，執行相應的副作用
  useEffect(() => {
    // 1-3. 根據 mode 的值來添加或移除 "dark" 類，這樣 Tailwind CSS 的暗模式樣式就會生效
    if (mode === "dark") {
      // document.documentElement 代表 HTML 根元素，classList 是一個 DOMTokenList，提供了操作元素類名的方法。add("dark") 是將 "dark" 類添加到 HTML 根元素的 class 列表中，這樣 Tailwind CSS 的暗模式樣式就會生效。
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 當主題或路徑改變時，關閉所有菜單
    setAdminMenuOpen(false);
    setUserMenuOpen(false);

    // 監聽鼠標點擊事件，如果點擊的元素不在用戶菜單內，則關閉菜單
    document.addEventListener("mousedown", (event) => {
      // 如果 userMenuRef 已經連到 DOM 元素，而且這次點擊的位置不在 user menu 裡面
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        // userMenuRef.current：用戶菜單的 DOM 元素
        // userMenuRef.current.contains(event.target)：userMenuRef 這個 DOM 節點裡面，有沒有包含這次被點到的元素
        setUserMenuOpen(false);
        setAdminMenuOpen(false);
      }
    });
  }, [mode, location.pathname]); //「只要 mode 或 pathname 改變，就重新執行這段 effect。」

  return (
    <header className="header border-gray-300 dark:border-gray-600 bg-normalbg dark:bg-darkbg">
      <div className="container">
        {/* Logo 導向（"/"） */}
        <Link to="/" className={`link ${DarkModeClass}`}>
          <FontAwesomeIcon icon={faNoteSticky} className="fa-icon" />
          <span className="brand-title">React 貼紙商城</span>
        </Link>
        <nav className="myNav">
          {/* DarkMode 切換按鈕，點擊後會觸發 toggleTheme 函式來切換主題（暗模式和亮模式） */}
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
              {/* 首頁 導向（"/"） */}
              <NavLink to="/home" className={getNavLinkClass}>
                首頁
              </NavLink>
            </li>
            <li>
              {/* 關於我們 導向（"/about"） */}
              <NavLink to="/about" className={getNavLinkClass}>
                關於我們
              </NavLink>
            </li>
            <li>
              {/* 聯絡我們 導向（"/contact"） */}
              <NavLink to="/contact" className={getNavLinkClass}>
                聯絡我們
              </NavLink>
            </li>
            <li className="flex items-center">
              {/* 用戶菜單（如果已登入顯示菜單內容） */}
              {isAuthenticated ? (
                <>
                  {/* userMenuRef 代表下拉選單的 DOM 元素 */}
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="relative text-brand"
                    >
                      <span
                        className={`${menuClass} text-purple-500 hover:text-purple-600`}
                      >
                        {/* 動態顯示用戶名稱，如果超過5個字就只顯示前5個字 */}
                        {`你好 ${
                          user.name.length > 5
                            ? `${user.name.slice(0, 5)}...` // 如果用戶名稱超過5個字就只顯示前5個字
                            : user.name // 如果用戶名稱不超過5個字就顯示完整用戶名稱
                        }`}
                      </span>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="text-brand dark:text-light w-6 h-6"
                      />
                    </button>
                    {/* 用戶菜單 下拉選單 */}
                    {isUserMenuOpen && ( // isUserMenuOpen 為 true 時顯示下拉選單
                      <div className="absolute right-0 w-48 bg-normalbg dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20 transition ease-in-out duration-200">
                        <ul className="py-2">
                          <li>
                            <Link to="/profile" className={dropdownLinkClass}>
                              個人檔案
                            </Link>
                          </li>
                          <li>
                            <Link to="/orders" className={dropdownLinkClass}>
                              我的訂單
                            </Link>
                          </li>
                          {isAdmin && ( // 如果 isAdmin 為 true，則顯示管理者選單
                            <li>
                              <button
                                onClick={toggleAdminMenu}
                                className={`${dropdownLinkClass} flex items-center justify-between`}
                              >
                                <div className="text-green-800 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                  管理者
                                </div>
                                <div>
                                  <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                              </button>
                              {/* 管理者下拉選單 */}
                              {isAdminMenuOpen && ( // isAdminMenuOpen 為 true 時顯示下拉選單
                                <ul className="ml-4 mt-2 space-y-2">
                                  <li>
                                    <Link
                                      to="/admin/orderManage"
                                      className={dropdownLinkClass}
                                    >
                                      <div className="text-green-600 hover:text-green-700 dark:text-green-100 dark:hover:text-green-200">
                                        訂單管理
                                      </div>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/admin/messages"
                                      className={dropdownLinkClass}
                                    >
                                      <div className="text-green-600 hover:text-green-700 dark:text-green-100 dark:hover:text-green-200">
                                        信息管理
                                      </div>
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </li>
                          )}

                          <li>
                            <button
                              type="button"
                              onClick={handleLogout} // 點擊後執行登出處理
                              className={`${dropdownLinkClass}  text-red-800 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300`}
                            >
                              登出
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* login 導向（"/login"） */}
                  <NavLink to="/login" className={getNavLinkClass}>
                    <div className="text-purple-500 hover:text-purple-600">
                      會員登入
                    </div>
                  </NavLink>
                </>
              )}
            </li>
            <li>
              {/* 購物車 導向（"/cart"） */}
              <Link
                to="/cart"
                className={`navLink ${DarkModeClass} ${getNavLinkClass} relative text-brand py-2`}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  size="lg"
                  className="text-brand dark:text-light w-6"
                />

                <div className="absolute -top-2 -right-6 text-xs bg-yellow-400 text-black font-semibold rounded-full px-2 py-1 leading-none">
                  {totalQuantity}
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
