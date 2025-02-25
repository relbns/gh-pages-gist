import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - replace 'gist-storage-app' with your repo name
  base: '/gh-pages-gist/',
  css: {
    postcss: './postcss.config.js',
  },
})