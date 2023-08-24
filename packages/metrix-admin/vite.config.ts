import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          // 将 node_modules 中的代码单独打包成一个 JS 文件
          if(id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
