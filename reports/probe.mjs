// Reports section offsets + pipe/faucet alignment so screenshots can target exact scroll positions.
import { chromium } from 'playwright'
const url = process.argv[2] ?? 'http://localhost:5175'
const width = Number(process.argv[3] ?? 1440)
const height = Number(process.argv[4] ?? 900)
const browser = await chromium.launch()
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width, height } })
const page = await ctx.newPage()
const problems = []
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text()}`) })
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const info = await page.evaluate(() => {
  const out = { doc: document.documentElement.scrollHeight, vw: window.innerWidth, sections: {} }
  for (const el of document.querySelectorAll('section[id], footer')) {
    const r = el.getBoundingClientRect()
    out.sections[el.id || 'footer'] = { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) }
  }
  return out
})
// scroll to the very bottom so the water finishes filling
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
await page.waitForTimeout(2000)
const align = await page.evaluate(() => {
  const path = document.querySelector('[data-pipe-water]')
  const inlet = document.getElementById('faucet-inlet')
  if (!path || !inlet) return { error: !path ? 'no water path' : 'no inlet' }
  const len = path.getTotalLength()
  const end = path.getPointAtLength(len)
  const svg = path.ownerSVGElement
  const svgRect = svg.getBoundingClientRect()
  const r = inlet.getBoundingClientRect()
  const style = getComputedStyle(path)
  return {
    pathEnd: { x: +end.x.toFixed(1), y: +end.y.toFixed(1) },
    inletDoc: { x: +(r.left + r.width / 2 + window.scrollX).toFixed(1), y: +(r.top + r.height / 2 + window.scrollY).toFixed(1) },
    svgTopLeftDoc: { x: +(svgRect.left + window.scrollX).toFixed(1), y: +(svgRect.top + window.scrollY).toFixed(1) },
    dashoffset: style.strokeDashoffset,
    dasharray: style.strokeDashArray || style.strokeDasharray,
    totalLength: +len.toFixed(1),
  }
})
await browser.close()
console.log(JSON.stringify({ info, align, problems }, null, 1))
