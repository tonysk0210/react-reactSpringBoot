import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

// 這是 Vite 的配置文件，類似於 Spring Boot 的 application.properties
export default defineConfig({
  plugins: [react(), tailwindcss()], // 使用 React 和 Tailwind CSS 的 Vite 插件

  // 部屬環境優化設定
  build: {
    outDir: "dist", // 設定輸出目錄為 dist
    sourcemap: false,
    minify: "esbuild", // 使用 esbuild 進行壓縮
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor";
          }

          if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
            return "redux";
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (
            id.includes("@fortawesome/react-fontawesome") ||
            id.includes("@fortawesome/fontawesome-svg-core")
          ) {
            return "ui";
          }
        },
      },
    },
  },
  base: "/",
  server: { port: 5173 }, // 開發伺服器 (Dev Server)
  preview: { port: 5173 }, // 預覽 production build
});
