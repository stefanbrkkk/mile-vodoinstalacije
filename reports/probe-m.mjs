import { chromium, devices } from 'playwright'
const url = process.argv[2] ?? 'http://localhost:5175'
const width = Number(process.argv[3] ?? 390)
const height = Number(process.argv[4] ?? 844)
const browser = await chromium.launch()
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width, height }, hasTouch: true, isMobile: true, userAgent: devices['Pixel 7'].userAgent })
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const info = await page.evaluate(() => {
  const out = { doc: document.documentElement.scrollHeight, sections: {} }
  for (const el of document.querySelectorAll('section[id]')) {
    const r = el.getBoundingClientRect()
    out.sections[el.id] = { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) }
  }
  const wrap = document.querySelector('#anatomija > div[class*="380vh"]')
  if (wrap) { const r = wrap.getBoundingClientRect(); out.anatomyWrap = { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) } }
  return out
})
await browser.close()
console.log(JSON.stringify(info))
