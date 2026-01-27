import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',              // ⭐ THIS IS THE FIX
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.png'],
  server: {
    host: true
  }
})
