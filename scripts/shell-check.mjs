// Checks the static hero shell: hidden on a fast load (no flash), visible on a slow load, and the
// app then skips the intro. node scripts/shell-check.mjs [url]
import { chromium } from 'playwright'
const base = process.argv[2] ?? 'http://localhost:4173/'
const browser = await chromium.launch()
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 } })
// slow path: delay the JS bundle by 1.8s
const slow = await ctx.newPage()
await slow.route('**/assets/*.js', async (route) => {
  await new Promise((r) => setTimeout(r, 1800))
  await route.continue()
})
await slow.goto(base, { waitUntil: 'commit' })
await slow.waitForTimeout(300)
const earlyOpacity = await slow.evaluate(() => getComputedStyle(document.querySelector('.shell-reveal')).opacity)
await slow.waitForTimeout(1000)
const shellVisible = await slow.evaluate(() => Number(getComputedStyle(document.querySelector('.shell-reveal')).opacity) > 0.9)
const shellText = await slow.locator('#root h1').innerText()
await slow.screenshot({ path: 'reports/shell-slow-1300ms.png' })
await slow.waitForTimeout(2500)
const afterMount = await slow.evaluate(() => ({
  shellGone: !document.querySelector('.shell-reveal'),
  loader: !!document.querySelector('[data-loader]'),
  h1Visible: (() => {
    const w = document.querySelector('#vrh h1 span span')
    if (!w) return false
    const r = w.getBoundingClientRect()
    const p = w.parentElement.getBoundingClientRect()
    return r.top < p.bottom && Number(getComputedStyle(w).opacity) > 0.9
  })(),
}))
await slow.screenshot({ path: 'reports/shell-slow-after-mount.png' })
// fast path: shell must never become visible
const fast = await ctx.newPage()
await fast.goto(base, { waitUntil: 'commit' })
await fast.waitForTimeout(200)
const fastShell = await fast.evaluate(() => {
  const el = document.querySelector('.shell-reveal')
  return el ? getComputedStyle(el).opacity : 'replaced'
})
await browser.close()
console.log(JSON.stringify({ earlyOpacity, shellVisible, shellText: shellText.replace(/\s+/g, ' '), afterMount, fastShell }, null, 1))
