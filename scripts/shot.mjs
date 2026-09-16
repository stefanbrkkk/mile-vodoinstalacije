// Screenshot + console diagnostics helper.
// node scripts/shot.mjs <url> [--w 1440] [--h 900] [--scroll 1200|#id] [--rm] [--touch] [--full] [--out reports/x.png] [--wait 800]
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const args = process.argv.slice(2)
const url = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:5173'
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : def
}
const flag = (name) => args.includes(`--${name}`)

const width = Number(opt('w', 1440))
const height = Number(opt('h', 900))
const out = opt('out', `reports/shot-${width}x${height}.png`)
const wait = Number(opt('wait', 800))
const scroll = opt('scroll', null)
const touch = flag('touch')

mkdirSync(dirname(out), { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({
  // The sandbox egress proxy re-terminates TLS with a CA that Chromium's NSS store does not hold;
  // this only affects the headless verification browser (Google Fonts), never the site itself.
  ignoreHTTPSErrors: true,
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: flag('rm') ? 'reduce' : 'no-preference',
  hasTouch: touch,
  isMobile: touch,
  userAgent: touch ? devices['Pixel 7'].userAgent : undefined,
})
const page = await context.newPage()
const problems = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') problems.push(`[console.${m.type()}] ${m.text()}`)
})
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`))
page.on('response', (r) => {
  if (r.status() >= 400) problems.push(`[http ${r.status()}] ${r.url()}`)
})
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
if (scroll) {
  if (scroll.startsWith('#')) {
    await page.evaluate((id) => document.querySelector(id)?.scrollIntoView({ behavior: 'auto' }), scroll)
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), Number(scroll))
  }
  await page.waitForTimeout(wait)
}
const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  scrollY: window.scrollY,
  docHeight: document.documentElement.scrollHeight,
}))
await page.screenshot({ path: out, fullPage: flag('full') })
await browser.close()
console.log(JSON.stringify({ out, ...overflow, horizontalOverflow: overflow.scrollWidth > overflow.innerWidth }, null, 1))
if (problems.length) {
  console.log('PROBLEMS:\n' + problems.join('\n'))
  process.exitCode = 2
} else {
  console.log('no console errors / failed requests')
}
