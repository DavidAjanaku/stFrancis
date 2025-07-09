import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Remove the proxy configuration to avoid path rewriting issues
    // Let the frontend make direct requests to the backend
  },
});