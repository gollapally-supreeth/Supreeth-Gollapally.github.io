import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.png'],
  server: {
    host: true
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js and all R3F ecosystem into one lazy chunk
          if (
            id.includes('three') ||
            id.includes('@react-three/fiber') ||
            id.includes('@react-three/drei') ||
            id.includes('meshline') ||
            id.includes('ogl') ||
            id.includes('gl-matrix')
          ) {
            return 'three-bundle';
          }
          // Physics engine is very large – separate chunk
          if (id.includes('@react-three/rapier') || id.includes('@dimforge')) {
            return 'physics-bundle';
          }
          // Framer Motion in its own chunk
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          // GSAP
          if (id.includes('gsap')) {
            return 'gsap';
          }
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // Everything else in node_modules → vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
