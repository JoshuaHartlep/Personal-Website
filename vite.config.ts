import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // More aggressive compression for better performance
      jpeg: { quality: 70 }, // Reduced quality for better compression
      jpg: { quality: 70 },
      png: { quality: 75, palette: true },
      webp: { quality: 65 }, // Much more aggressive WebP compression
      cache: true, // Cache optimized images to avoid re-processing
      // Exclude already optimized thumbnails from optimization
      exclude: /thumbnail/i,
    })
  ],
  assetsInclude: ['**/*.JPG'], // Include uppercase JPG files as assets
  resolve: {
    alias: {
      path: 'path-browserify',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
