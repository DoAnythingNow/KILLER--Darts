import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    rollupOptions: {
      input: 'vite-index.html',
    },
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 3000,
    open: '/vite-index.html',
  },
});
