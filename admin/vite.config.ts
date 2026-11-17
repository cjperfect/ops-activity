import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const srcDir = fileURLToPath(new URL("./src", import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // 统一用 @ 指向 src，与 shadcn 的约定保持一致
      "@": path.resolve(srcDir),
    },
  },
  server: {
    port: 5273,
    strictPort: false,
  },
})
