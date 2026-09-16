import { chromium } from 'playwright'
const url = 'http://localhost:5175'
const browser = await chromium.launch()
const out = {}
// --- copy: success path (clipboard permission granted)
{
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.evaluate(() => document.getElementById('kontakt').scrollIntoView())
  await page.waitForTimeout(2600)
  await page.getByRole('button', { name: 'Kopiraj' }).click()
  await page.waitForTimeout(300)
  out.copyOk = await page.locator('#kontakt [aria-live="polite"]').innerText()
  out.clipboard = await page.evaluate(() => navigator.clipboard.readText())
  // droplet burst
  const card = page.locator('#kontakt .glass')
  const box = await card.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(120)
  out.burstDrops = await page.evaluate(() => document.querySelectorAll('#kontakt .pointer-events-none.absolute span').length)
  await page.mouse.up()
  await page.waitForTimeout(900)
  out.burstAfter = await page.evaluate(() => document.querySelectorAll('#kontakt .pointer-events-none.absolute span').length)
  // focus visibility on the email link
  await page.keyboard.press('Tab')
  out.errors = errs
  await ctx.close()
}
// --- copy: failure path (no permission => writeText rejects)
{
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) }, configurable: true })
    document.getElementById('kontakt').scrollIntoView()
  })
  await page.waitForTimeout(2600)
  await page.getByRole('button', { name: 'Kopiraj' }).click()
  await page.waitForTimeout(300)
  out.copyFail = await page.locator('#kontakt [aria-live="polite"]').innerText()
  out.selection = await page.evaluate(() => window.getSelection().toString())
  await ctx.close()
}
// --- anatomy: forward then backward
{
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const range = await page.evaluate(() => {
    const wrap = document.querySelector('#anatomija > div')
    const top = wrap.getBoundingClientRect().top + window.scrollY
    return { top, end: top + wrap.offsetHeight - window.innerHeight }
  })
  const read = async () => page.evaluate(() => {
    const counter = document.querySelector('#anatomija .font-mono').textContent
    const cards = [...document.querySelectorAll('#anatomija [data-card]')]
    const visible = cards.map((c, i) => [i, +getComputedStyle(c).opacity]).filter(([, o]) => o > 0.5).map(([i]) => i)
    const transforms = [...document.querySelectorAll('#anatomija [data-part]')].map((p) => p.getAttribute('transform') || 'none')
    return { counter, visible, transforms }
  })
  const at = async (p) => { await page.evaluate((y) => window.scrollTo(0, y), range.top + (range.end - range.top) * p); await page.waitForTimeout(1400); return read() }
  out.anatomyForward = { p20: await at(0.2), p50: await at(0.5), p90: await at(0.9) }
  out.anatomyBack = { p50: await at(0.5), p20: await at(0.2), p0: await at(0.01) }
  await ctx.close()
}
await browser.close()
console.log(JSON.stringify(out, null, 1))
