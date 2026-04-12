import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./footer.css"; // 匯入 Footer 的 CSS; 全域 CSS（global scope）

export default function Footer() {
  return (
    <footer className="footer">
      Built with{" "}
      <FontAwesomeIcon
        icon={faHeart}
        className="footer-icon"
        aria-hidden="true"
      />
      {/* aria-hidden="true" = 這個元素「存在於畫面上」，但「不要讓輔助工具讀到」 */}{" "}
      by{" "}
      <a href="/" target="_blank" rel="noreferrer">
        {/* rel="noreferrer" = 點連結時，不要把「你從哪個頁面來」告訴對方網站 */}
        Anthony
      </a>
    </footer>
  );
}
