import { redirect } from "react-router-dom";

export function requireAuth(redirectPath) {
  const jwtToken = localStorage.getItem("jwtToken");

  // 如果沒有 jwtToken，表示用戶未登入，則將用戶原本想去的路徑存入 sessionStorage 中，然後重定向到 "/login" 頁面。
  if (!jwtToken) {
    sessionStorage.setItem("redirectPath", redirectPath);
    throw redirect("/login");
  }

  return jwtToken; // 目前 jwtToken 沒有被用到，但這裡返回它是為了以防未來需要在 loader 中使用 jwtToken 來加載數據，例如獲取用戶資料等。
}
