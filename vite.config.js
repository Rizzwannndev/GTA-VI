import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: these change far less often than the app.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('gsap')) return 'vendor-gsap'
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('react') || id.includes('scheduler')) return 'vendor-react'
          if (id.includes('lenis')) return 'vendor-lenis'
          return undefined
        },
      },
    },
  },
})
