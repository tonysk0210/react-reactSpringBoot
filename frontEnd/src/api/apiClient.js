import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 從環境變數讀取 API 基礎 URL; meta.env 是 Vite 提供的方式來讀取環境變數
  timeout: 10000, // 10 秒 timeout
  headers: {
    "Content-Type": "application/json", // 設定請求頭為 JSON
  },
});

export default apiClient;
