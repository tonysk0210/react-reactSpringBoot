import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 從環境變數讀取 API 基礎 URL; meta.env 是 Vite 提供的方式來讀取環境變數
  timeout: 10000, // 10 秒 timeout
  headers: {
    "Content-Type": "application/json", // 設定請求頭為 JSON 格式；我傳給後端的資料格式是 JSON
    Accept: "application/json", // 設定回應頭為 JSON 格式；我想要後端回傳的資料格式是 JSON
  },
  withCredentials: true, // 啟用 Axios 的 withCredentials 設定
});

// 註冊一個 request interceptor
apiClient.interceptors.request.use(
  // 第一個 = success response 把 JWT 加進 header。
  async (config) => {
    // config 是這次 request 的設定 object
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`; // 在 HTTP request header 加上一個 Authorization 欄位，裡面放 JWT token。
    }

    // Only fetch CSRF token for non-safe methods
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    if (!safeMethods.includes(config.method.toUpperCase())) {
      // 只有非安全方法才需要 CSRF token

      // 1. 從 cookies 中取得 CSRF token
      let csrfToken = Cookies.get("XSRF-TOKEN");
      if (!csrfToken) {
        // 2. 如果 cookies 中沒有 CSRF token，則呼叫 api 從後端取得
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
  // 第二個 = failed response 把錯誤繼續往外丟
  (error) => Promise.reject(error),
);

export default apiClient;
