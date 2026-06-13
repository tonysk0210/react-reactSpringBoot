import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth-context"; // 從 auth-context 導入 useAuth hook
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth(); // 從 context 中取得 isAuthenticated 屬性，這個屬性表示用戶是否已經登入了。
  const location = useLocation();

  const logoutRedirect = sessionStorage.getItem("logoutRedirect") === "true"; // 是不是因為「使用者剛剛按了登出」

  // 1. 在未登入使用者想進入 protected route 時，把他原本想去的路徑先記下來，讓登入成功後可以導回去。
  // 2. 分成兩種「未登入」情境處理：
  //    - 一般未登入使用者想進 protected route，例如 /checkout
  //    - 使用者剛從 protected route 登出，例如從 /profile 登出
  useEffect(() => {
    // - 使用者剛從 protected route 登出，例如從 /profile 登出
    if (logoutRedirect) {
      sessionStorage.removeItem("logoutRedirect"); // 清除登出導向標記，並且不要把目前 protected route 寫進 redirectPath
      return;
    }

    const skipRedirect = sessionStorage.getItem("skipRedirectPath") === "true"; // 檢查是否跳過重定向
    if (!isAuthenticated && location.pathname !== "/login" && !skipRedirect) {
      // - 一般未登入使用者想進 protected route，例如 /checkout
      sessionStorage.setItem("redirectPath", location.pathname); // redirectPath 存的是「被擋下來的目標頁」/checkout
    }
  }, [isAuthenticated, location.pathname, logoutRedirect]); // 當認證狀態、路由位置或登出導向狀態變化時執行

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={logoutRedirect ? "/home" : "/login"} replace />
  ); // 未登入 + 是登出造成的 → 導到 /home ; 未登入 + 一般想進 protected route → 導到 /login
}

// location 物件結構
// {
//   pathname: "/checkout",
//   search: "",
//   hash: "",
//   state: null,
//   key: "abc123"
// }
