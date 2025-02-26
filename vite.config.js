// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/gh-pages-gist/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Ensure proper file extensions and formats
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Make sure sourcemaps are disabled in production
    sourcemap: false,
  },
  // Ensure the proper MIME types for JSX files
  server: {
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
})