import Header from "./components/Header";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";

import { Outlet } from "react-router-dom"; // 引入 Outlet 組件；Outlet 是 React Router 中的一個組件，用於在父路由中渲染子路由的內容
import { useNavigation } from "react-router-dom"; // 引入 useNavigation hook；這個 hook 是 React Router 中用於獲取當前導航狀態的 hook，
// 可以用來判斷當前是否正在進行導航，例如：正在加載新頁面、正在提交表單等等，從而可以在 UI 上顯示相應的加載指示器或者禁用某些按鈕等等。

function App() {
  const navigation = useNavigation(); // 使用 useNavigation hook 來獲取當前導航狀態，這個狀態會在導航過程中發生變化，例如：當正在加載新頁面時，navigation.state 會變為 "loading"，當導航完成後，navigation.state 會變為 "idle"。

  return (
    <>
      <Header />
      {/* 根據導航狀態來決定是否顯示加載指示器 */}
      {navigation.state === "loading" ? (
        <div className="flex items-center justify-center min-h-213">
          <span className="text-4xl font-semibold text-brand dark:text-light">
            Loading...
          </span>
        </div>
      ) : (
        // 如果不是正在加載狀態，則渲染 Outlet 組件，這樣當路由匹配到 App 組件時，就會在 Outlet 的位置渲染對應的子路由組件，例如：Home、About、Contact 等等
        <Outlet />
      )}
      <Footer />
    </>
  );
}

export default App;
