import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import cssModule from "./footer.module.css"; //  1. 只有 import 這個 module 的檔案，才能透過 cssModule.footer 拿到那個產生後的 class name。
import styledComponents from "styled-components"; // 2. 引入 styled-components 套件

// 2.1使用 styledComponents 物件的 p 方法創建一個 Paragraph 組件，這個組件是一個 <p> 元素，並且根據傳入的 $primary props 來決定文字顏色
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
      {/* 1.1使用 cssModule 的 className; 注意：className={cssModule.footer} 的寫法 */}
      <footer className={`${cssModule.footer} ${DarkModeClass}`}>
        Built with{" "}
        <FontAwesomeIcon
          icon={faHeart}
          className={cssModule["footer-icon"]}
          // 1.2 使用 cssModule 的 className; 注意：因為 class name 中有連字號（-），所以要用 className={cssModule["footer-icon"]} 的寫法
          aria-hidden="true"
        />
        by{" "}
        <a href="/" target="_blank" rel="noreferrer">
          Anthony
        </a>
      </footer>
      {/* 2.2 使用 styled-components 套件。注意 props 的寫法：$primary 是一個自定義的 props，$ 是一個慣例，表示這個 props 只給 styled-components 使用，不傳到 HTML */}
      <Paragraph $primary={true}>版權所有 © 2026 React 貼紙商城</Paragraph>
    </>
  );
}
