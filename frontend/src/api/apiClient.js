import axios from "axios";
import Cookies from "js-cookie";

// 1. 建立一個 Axios 實例，設定 baseURL、timeout、headers 等預設值
const apiClient = axios.create({
  // import.meta.env 是 Vite 提供的環境變數存取方式，VITE_ 開頭的變數會被 Vite 注入到前端程式碼中
  baseURL: import.meta.env.VITE_API_BASE_URL, // 從環境變數讀取 API 基礎 URL
  timeout: 500000, // request 最多等 10 秒
  headers: {
    "Content-Type": "application/json", // request body 的資料格式是 JSON
    Accept: "application/json", // 告訴後端希望 response 回傳 JSON
  },
  withCredentials: true, // 對 CSRF cookie 流程很可能是必要的
});

// 2. 註冊 request interceptor：在 request 送出前統一補上 JWT 與必要的 CSRF token。
apiClient.interceptors.request.use(
  // 第一個函式處理正常情況：會在 request 送出前執行；這裡可以修改 config，讓這次 request 自動帶上 JWT header。
  async (config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      // 2.1 在 HTTP request header 加上一個 Authorization 欄位，裡面放 JWT token。
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    // Only fetch CSRF token for non-safe methods
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    // 只有非安全方法才需要 CSRF token
    if (!safeMethods.includes(config.method.toUpperCase())) {
      // 2.2 從 cookies 中取得 CSRF token
      let csrfToken = Cookies.get("XSRF-TOKEN");
      if (!csrfToken) {
        // 2.3 如果 cookies 中沒有 CSRF token，則呼叫 api 從後端取得
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/csrf-token`, {
          withCredentials: true, // Axios 設定：允許瀏覽器在跨域請求中帶 cookies，並接收後端的 Set-Cookie: XSRF-TOKEN=abc123; 瀏覽器收到後，自動把 XSRF-TOKEN 存進 cookie
        });
        // 2.1 從 cookies 中取得 CSRF token
        csrfToken = Cookies.get("XSRF-TOKEN");
        // 2.2 如果還是沒有，則拋出錯誤
        if (!csrfToken) {
          throw new Error("無法取得 CSRF token");
        }
      }
      // 3. 將 CSRF token 加入 request header
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  // 第二個函式處理錯誤情況：不要在這裡吞掉錯誤，而是把錯誤繼續往外丟，讓呼叫 apiClient.get(...) / apiClient.post(...) 的地方可以用 catch 或 try...catch 接到。
  (error) => Promise.reject(error),
);

// 註冊一個 response interceptor 來處理 401 錯誤  ExpiredJwtException
// 這裡的 response / error 不是看 backend「有沒有正常寫出 response body」，而是看 Axios 怎麼判斷 HTTP status
apiClient.interceptors.response.use(
  (response) => response, // 如果成功，就直接回傳 response: 2xx 會進這裡
  async (error) => {
    // 如果失敗，就檢查 status code: 非 2xx 預設會進這裡; Axios 預設把非 2xx status 當錯誤
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized
      console.log(error.response.data); // "JWT Token 已過期！"

      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        localStorage.removeItem("jwtToken"); // 移除過期的 JWT token
        window.location.href = "/login"; // 跳轉到登入頁面；但不會立即停止 JavaScript 執行， ErrorPage 短暫顯示
      }
    }
    return Promise.reject(error); // 把錯誤繼續往外丟 Promise 被 reject，等同於 throw error
  },
);

export default apiClient;
