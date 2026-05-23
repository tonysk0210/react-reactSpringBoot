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
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
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
  server: { port: 5173 },
  preview: { port: 5173 },
});
