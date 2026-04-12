import Header from "./components/Header";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";

import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 的 CSS；
// 注意：這裡引入的是「整個 Bootstrap 的 CSS」，而不是「Bootstrap 的 React 組件」
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 引入 Bootstrap 的 JavaScript；
// 注意：這裡引入的是「整個 Bootstrap 的 JavaScript」，而不是「Bootstrap 的 React 組件」
// 這樣做的目的是為了讓 Bootstrap 的 JavaScript 功能（例如：下拉選單、模態框等）能夠正常運作

function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

export default App;
