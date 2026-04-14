import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 引入 Tailwind CSS 的 Vite 插件

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // tailwindcss () 使用 Tailwind CSS 的 Vite 插件
  // 設定開發伺服器的port為3000
  // server: {
  //   port: 3000,
  // },
});
