import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  ssr: {
    noExternal: true
  },
  build: isSsrBuild
    ? {
        outDir: '../../backend/ssr',
        emptyOutDir: true,
        copyPublicDir: false,
        rollupOptions: {
          input: 'src/ssr/renderPage.jsx',
          output: {
            format: 'cjs',
            entryFileNames: 'renderPage.cjs'
          }
        }
      }
    : {}
}))