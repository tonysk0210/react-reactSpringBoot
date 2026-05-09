import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 從環境變數讀取 API 基礎 URL; meta.env 是 Vite 提供的方式來讀取環境變數
  timeout: 10000, // 10 秒 timeout
  headers: {
    "Content-Type": "application/json", // 設定請求頭為 JSON 格式；我傳給後端的資料格式是 JSON
    Accept: "application/json", // 設定回應頭為 JSON 格式；我想要後端回傳的資料格式是 JSON
  },
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
    return config;
  },
  // 第二個 = failed response 把錯誤繼續往外丟
  (error) => Promise.reject(error),
);

export default apiClient;
