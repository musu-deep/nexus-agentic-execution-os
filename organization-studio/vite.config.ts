import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: process.env.NEXUS_PROXY_TARGET || "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/health": {
        target: process.env.NEXUS_PROXY_TARGET || "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  }
});
