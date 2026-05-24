import PageTitle from "./PageTitle";

const DarkModeClass = "dark:text-light hover:text-dark dark:hover:text-lighter";

export default function PageHeading({ title, children }) {
  return (
    <div className="page-heading-container">
      <PageTitle title={title} /> {/* title 傳給 PageTitle */}
      <p className={`page-heading-paragraph ${DarkModeClass}`}>{children}</p>
    </div>
  );
}
