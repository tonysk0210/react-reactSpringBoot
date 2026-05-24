import { Outlet, Navigate, useLocation } from "react-router-dom"; // 從 react-router-dom 導入 Outlet 組件
import { useAuth } from "../../store/auth-context"; // 從 auth-context 導入 useAuth hook
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth(); // 使用 useAuth hook 獲取認證狀態
  const location = useLocation(); // 獲取當前路由位置 useLocation() 看的是 URL，不是 component。

  // 如果未登入且不在登入頁面，則儲存當前路徑
  useEffect(() => {
    const skipRedirect = sessionStorage.getItem("skipRedirectPath") === "true"; // 檢查是否跳過重定向
    if (!isAuthenticated && location.pathname !== "/login" && !skipRedirect) {
      sessionStorage.setItem("redirectPath", location.pathname); // 儲存當前路徑到 sessionStorage 供登入後跳轉到該頁面
    }
  }, [isAuthenticated, location.pathname]); // 當認證狀態或路由位置變化時執行 (ProtectedRoute component rerender 之後，React 用它來判斷這個 effect 要不要重新執行)

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />; // 如果已登入，返回 Outlet 組件，否則導航到 login 頁面
}

// location 物件結構
// {
//   pathname: "/checkout",
//   search: "",
//   hash: "",
//   state: null,
//   key: "abc123"
// }
