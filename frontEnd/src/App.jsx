import Header from "./components/Header";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";

import { Outlet } from "react-router-dom"; // 引入 Outlet 組件；Outlet 是 React Router 中的一個組件，用於在父路由中渲染子路由的內容

function App() {
  return (
    <>
      <Header />
      {/* 使用 Outlet 組件，這樣當路由匹配到 App 組件時，就會在 Outlet 的位置渲染對應的子路由組件，例如：Home、About、Contact 等等 */}
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
