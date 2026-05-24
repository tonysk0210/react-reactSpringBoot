import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import cssModule from "./footer.module.css"; // 匯入 Footer 的 CSS Module 取名為 cssModule ; 區域 CSS（local scope）變數
import styledComponents from "styled-components"; // 引入 styled-components 套件

// 使用 styled-components 定義一個 Paragraph 組件，
// 這個組件是一個 <p> 元素，並且根據傳入的 $primary props 來決定文字顏色
const Paragraph = styledComponents.p`
  color: ${({ $primary }) => ($primary ? "rgba(233, 11, 233, 0.81)" : "rgba(231, 97, 7, 0.5)")};
  font-size: 20px;
  text-align: center;
`;

const DarkModeClass =
  "text-brand dark:text-light hover:text-dark dark:hover:text-lighter";

export default function Footer() {
  return (
    <>
      {/* 使用 CSS Module 的 className; 注意：className={cssModule.footer} 的寫法 */}
      <footer className={`${cssModule.footer} ${DarkModeClass}`}>
        Built with{" "}
        <FontAwesomeIcon
          icon={faHeart}
          className={cssModule["footer-icon"]}
          // 使用 CSS Module 的 className; 注意：因為 class name 中有連字號（-），所以要用 cssModule["footer-icon"] 的寫法
          aria-hidden="true"
        />
        {/* aria-hidden="true" = 這個元素「存在於畫面上」，但「不要讓輔助工具讀到」 */}{" "}
        by{" "}
        <a href="/" target="_blank" rel="noreferrer">
          {/* rel="noreferrer" = 點連結時，不要把「你從哪個頁面來」告訴對方網站 */}
          Anthony
        </a>
      </footer>
      {/* 使用 styled-components 套件。注意 props 的寫法：$primary 是一個自定義的 props，$ 是一個慣例，表示這個 props
      是用來控制樣式的 */}
      <Paragraph $primary={true}>版權所有 © 2026 React 貼紙商城</Paragraph>
    </>
  );
}
