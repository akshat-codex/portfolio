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
          // Exact package match: a loose '/react' also caught react-icons, @number-flow/react,
          // lenis/react… creating a react <-> vendor import cycle that ran vendor before React
          // existed (blank page: "Cannot read properties of undefined (reading 'forwardRef')").
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          return 'vendor'
        },
      },
    },
  },
})
