import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  preview: {
    port: 4173,
    strictPort: true,
    allowedHosts: [
      'stfrancis-52b1.onrender.com',
      'stfrancis-1.onrender.com',
      'distinct-stranger-production.up.railway.app'
    ]
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:5173"
  }
})