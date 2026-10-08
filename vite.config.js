import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Inline the built stylesheet into index.html. Asset file names carry a
// content hash that changes on every deploy, and the SPA rewrite in
// vercel.json answers any unknown path with index.html — so a session
// recorder (Yandex Webvisor) replaying an older visit fetched HTML instead
// of CSS and showed an unstyled page. With the CSS inside the document the
// recorded DOM snapshot already carries its styles.
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (!fileName.endsWith('.css')) continue
          const link = new RegExp(`<link[^>]*href="/${fileName}"[^>]*>`)
          if (!link.test(html)) continue
          html = html.replace(link, `<style>${asset.source}</style>`)
          delete bundle[fileName]
        }
        return html
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inlineCss()],
})
