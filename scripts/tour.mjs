// Visual tour: screenshots of every section (and progress points of pinned ones) in one session.
// node scripts/tour.mjs <url> --w 1440 --h 900 [--touch] [--rm] [--dir reports/tour-1440]
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const url = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:5173'
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d)
const flag = (n) => args.includes(`--${n}`)
const width = Number(opt('w', 1440))
const height = Number(opt('h', 900))
const touch = flag('touch')
const rm = flag('rm')
const dir = opt('dir', `reports/tour-${width}${rm ? '-rm' : ''}`)
mkdirSync(dir, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  ignoreHTTPSErrors: true,
  viewport: { width, height },
  hasTouch: touch,
  isMobile: touch,
  userAgent: touch ? devices['Pixel 7'].userAgent : undefined,
  reducedMotion: rm ? 'reduce' : 'no-preference',
})
const page = await context.newPage()
const problems = []
page.on('console', (m) => m.type() === 'error' && problems.push(`[console.error] ${m.text()}`))
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)

const rect = (id) => page.locator(`#${id}`).evaluate((el) => ({ top: el.offsetTop, h: el.offsetHeight }))
const shoot = async (name, y, wait = 900) => {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(wait)
  await page.screenshot({ path: `${dir}/${name}.png` })
}
await shoot('01-hero', 0, 400)
await shoot('02-trust', (await rect('poverenje')).top - 80, 1800)
const a = await rect('anatomija')
for (const f of [0.12, 0.3, 0.48, 0.66, 0.84, 0.98]) await shoot(`03-anatomy-${Math.round(f * 100)}`, a.top + (a.h - height) * f)
await shoot('04-services', (await rect('usluge')).top - 60, 1500)
const p = await rect('kako-radim')
for (const f of [0.05, 0.5, 0.95]) await shoot(`05-process-${Math.round(f * 100)}`, p.top + (p.h - height) * f)
await shoot('06-before-after', (await rect('pre-posle')).top - 60)
await shoot('07-testimonials', (await rect('utisci')).top - 60)
await shoot('08-faq', (await rect('pitanja')).top - 60)
await shoot('09-contact', (await rect('kontakt')).top - 40, 3000)
await shoot('10-footer', 10 ** 6, 1200)
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log(JSON.stringify({ dir, overflow, problems }, null, 1))
await browser.close()
