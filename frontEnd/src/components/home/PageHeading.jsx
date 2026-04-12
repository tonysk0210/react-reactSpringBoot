import PageTitle from "./PageTitle";

export default function PageHeading({ title, children }) {
  return (
    <div className="page-heading-container">
      <PageTitle title={title} /> {/* title 傳給 PageTitle */}
      <p className="page-heading-paragraph">{children}</p>
    </div>
  );
}
