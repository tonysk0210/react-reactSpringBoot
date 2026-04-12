import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 設定開發伺服器的port為3000
  // server: {
  //   port: 3000,
  // },
});
