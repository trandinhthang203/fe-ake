import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"  // ← THÊM DÒNG NÀY
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← THÊM PLUGIN NÀY
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api_proxy': {
        target: 'http://16.176.176.145',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api_proxy/, ''),
      },
    },
  },
})
