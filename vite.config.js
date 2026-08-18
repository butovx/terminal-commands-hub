import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 3500,
    cssCodeSplit: false,
    minify: 'esbuild'
  }
});
