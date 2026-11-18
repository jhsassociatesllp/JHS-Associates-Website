import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/chatbot-api': {
        target: process.env.CHATBOT_PROXY_TARGET || 'http://localhost:3001',  // set to http://localhost:8100 to test the new ai-assistant
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatbot-api/, '/api'),
      },
    },
  },
})
