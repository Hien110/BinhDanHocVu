import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // "/api": {
      //   target: "https://political-theory-learning.onrender.com",
      //   changeOrigin: true,
      // },
      "/auth": {
        target: "https://political-theory-learning.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
