import { chromium } from 'playwright'
const [url, w, h, y, out, rm] = process.argv.slice(2)
const browser = await chromium.launch()
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: +w, height: +h }, reducedMotion: rm === 'rm' ? 'reduce' : 'no-preference' })
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.evaluate((yy) => window.scrollTo(0, yy), +y)
await page.waitForTimeout(2000)
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 140, height: +h } })
const sample = await page.evaluate(() => {
  const el = document.querySelector('[data-pipe-water]')
  const s = getComputedStyle(el)
  return { dasharray: s.strokeDasharray, dashoffset: s.strokeDashoffset, opacity: s.opacity, d: el.getAttribute('d')?.slice(0, 80) }
})
await browser.close()
console.log(JSON.stringify(sample))
