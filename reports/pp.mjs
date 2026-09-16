import { chromium, devices } from 'playwright'
const [w,h,touch] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4] === 'touch']
const b = await chromium.launch()
const c = await b.newContext({ ignoreHTTPSErrors: true, viewport:{width:w,height:h}, hasTouch:touch, isMobile:touch, userAgent: touch ? devices['Pixel 7'].userAgent : undefined })
const p = await c.newPage()
await p.goto('http://localhost:5175', { waitUntil:'networkidle' })
await p.waitForTimeout(1600)
console.log(JSON.stringify(await p.evaluate(() => {
  const s = document.getElementById('kako-radim')
  const top = Math.round(s.getBoundingClientRect().top + window.scrollY)
  const panel = document.querySelector('#kako-radim [data-panel]')
  const r = panel.getBoundingClientRect()
  return { top, h: s.offsetHeight, panel: { w: Math.round(r.width), h: Math.round(r.height) } }
})))
await b.close()
