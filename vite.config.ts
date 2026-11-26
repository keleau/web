import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    watch: {
      // 跳过 Chrome 预览资料目录 —— 里面的 Cookies / Sessions 等 SQLite 文件
      // 被运行中的 Chrome 独占锁住，文件监视器会持续抛 EBUSY 错误
      ignored: ['**/.preview/**'],
    },
  },
})
