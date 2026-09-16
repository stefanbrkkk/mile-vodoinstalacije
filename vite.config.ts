import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { site, seoTitle, seoDescription, jsonLd } from './src/config/site.ts'

/** Injects SEO/OG meta tags, JSON-LD and the static hero shell text into the served HTML (dev and build) from src/config/site.ts. */
function seoPlugin(): Plugin {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return {
    name: 'mile-seo-inject',
    transformIndexHtml(html) {
      const tags = [
        `<title>${esc(seoTitle)}</title>`,
        `<meta name="description" content="${esc(seoDescription)}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:title" content="${esc(seoTitle)}">`,
        `<meta property="og:description" content="${esc(seoDescription)}">`,
        `<meta property="og:locale" content="sr_RS">`,
        `<meta property="og:site_name" content="${esc(site.name)}">`,
        site.url ? `<meta property="og:url" content="${esc(site.url)}">` : '',
        `<meta name="twitter:card" content="summary">`,
        `<meta name="twitter:title" content="${esc(seoTitle)}">`,
        `<meta name="twitter:description" content="${esc(seoDescription)}">`,
        `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
      ].filter(Boolean)
      const shell: Record<string, string> = {
        wordmark: site.wordmark,
        heroWord1: site.hero.words[0],
        heroWord2: site.hero.words[1],
        heroWord3: site.hero.words[2],
        heroPunchline: site.hero.punchline,
        heroSubtitle: site.hero.subtitle,
        ctaPrimaryHref: site.cta.primary.href,
        ctaPrimaryLabel: site.cta.primary.label,
        ctaSecondaryHref: site.cta.secondary.href,
        ctaSecondaryLabel: site.cta.secondary.label,
      }
      return html
        .replace('<!--seo-->', tags.join('\n    '))
        .replace(/\{\{(\w+)\}\}/g, (_, key: string) => esc(shell[key] ?? ''))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssMinify: true,
  },
})
