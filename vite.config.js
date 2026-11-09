import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // shadcn-style imports used by the Aceternity / Skiper / React Bits components
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Stable vendor chunks cache across deploys; three.js lands in its own lazy chunk.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('/three/')) return 'three'
          if (id.includes('/gsap/')) return 'gsap'
          if (id.includes('/swiper/')) return 'swiper'
          if (id.includes('framer-motion') || id.includes('/motion/') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
          if (id.includes('/react') || id.includes('scheduler')) return 'react'
          return 'vendor'
        },
      },
    },
  },
})
