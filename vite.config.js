import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.png', '**/*.webp'],
  server: {
    host: true
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js, R3F, Rapier physics, and all related WebGL libs in one
          // lazy chunk — they are tightly coupled and always loaded together.
          // Splitting them causes circular chunk references at runtime.
          if (
            id.includes('node_modules/three/') ||
            id.includes('node_modules/@react-three/') ||
            id.includes('node_modules/@dimforge/') ||
            id.includes('node_modules/meshline/') ||
            id.includes('node_modules/ogl/') ||
            id.includes('node_modules/gl-matrix/')
          ) {
            return 'three-bundle';
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion/')) {
            return 'framer-motion';
          }
          // React core
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }
          // Everything else: let Rollup auto-chunk to avoid circular dependencies
        }
      }
    }
  }
})
