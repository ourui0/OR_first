// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/OR_first/',   // 仓库名，前面带斜杠
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ← 后端实际地址端口
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 可选：去掉 /api 前缀
      }
    }
  }
})