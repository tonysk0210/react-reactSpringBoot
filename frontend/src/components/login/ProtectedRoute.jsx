import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth-context"; // 從 auth-context 導入 useAuth hook
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth(); // 從 context 中取得 isAuthenticated 屬性，這個屬性表示用戶是否已經登入了。
  const location = useLocation();

  // 1. 在未登入使用者想進入 protected route 時，把他原本想去的路徑先記下來，讓登入成功後可以導回去。
  useEffect(() => {
    const skipRedirect = sessionStorage.getItem("skipRedirectPath") === "true"; // 檢查是否跳過重定向
    if (!isAuthenticated && location.pathname !== "/login" && !skipRedirect) {
      sessionStorage.setItem("redirectPath", location.pathname); // redirectPath 存的是「被擋下來的目標頁」
    }
  }, [isAuthenticated, location.pathname]); // 當認證狀態或路由位置變化時執行

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />; // 如果已經登入了，則渲染 Outlet 組件，Outlet 組件會渲染被保護的子路由；如果未登入，則使用 Navigate 組件來導航到 "/login" 路由。
}

// location 物件結構
// {
//   pathname: "/checkout",
//   search: "",
//   hash: "",
//   state: null,
//   key: "abc123"
// }
