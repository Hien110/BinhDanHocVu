import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  build: {
    sourcemap: false,      // giảm dung lượng dist
    target: 'es2018',
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Tách vendor lớn để cache – KHÔNG cần splitVendorChunkPlugin
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-ck': ['@ckeditor/ckeditor5-react', '@ckeditor/ckeditor5-build-classic'],
          'vendor-charts': ['recharts']
        }
      }
    }
  },

  server: {
    proxy: {
      // Chỉ dùng khi dev local
      '/auth': {
        target: 'https://binhdansobe.azurewebsites.net',
        changeOrigin: true,
        secure: false
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
