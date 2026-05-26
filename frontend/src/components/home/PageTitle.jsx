// Tailwind CSS 的類，用於設定導航連結在暗模式下的樣式。
const DarkModeClass =
  "text-brand dark:text-light hover:text-dark dark:hover:text-lighter";

export default function PageTitle({ title }) {
  return <h1 className={`page-title ${DarkModeClass}`}>{title}</h1>;
}
