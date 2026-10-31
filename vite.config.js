import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Preload what the first screen needs, so it downloads alongside the vendor
// scripts instead of after them: the Latin subset of Archivo, the home
// page chunk and the hero logo (the home page's largest paint). File names
// are hashed at build time, so they are looked up in the bundle.
function preloadFirstScreen() {
  return {
    name: 'preload-first-screen',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle ?? {})
        const find = (re) => files.find((f) => re.test(f))
        const font = find(/archivo-latin-wdth-normal-.*\.woff2$/)
        const home = find(/^assets\/Home-.*\.js$/)
        const logo = find(/gta6-logo-1000-.*\.avif$/)
        const tags = []
        if (font) tags.push({ tag: 'link', attrs: { rel: 'preload', href: `/${font}`, as: 'font', type: 'font/woff2', crossorigin: '' }, injectTo: 'head-prepend' })
        // Only worth it on the home page; elsewhere these are skipped.
        const onHome = `(location.pathname === '/' || location.pathname === '')`
        const links = [home && `['modulepreload','/${home}','']`, logo && `['preload','/${logo}','image']`].filter(Boolean)
        if (links.length)
          tags.push({
            tag: 'script',
            children: `if ${onHome} for (const [r, h, a] of [${links.join(',')}]) { const l = document.createElement('link'); l.rel = r; l.href = h; if (a) { l.as = a; l.type = 'image/avif'; l.fetchPriority = 'high'; } document.head.appendChild(l); }`,
            injectTo: 'head',
          })
        return tags
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFirstScreen()],
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
