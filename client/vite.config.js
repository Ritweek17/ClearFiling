import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run/router')
          ) {
            return 'vendor-router';
          }
          if (
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/motion-dom') ||
            id.includes('node_modules/motion-utils')
          ) {
            return 'vendor-framer-motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
        },
      },
    },
  },
});
