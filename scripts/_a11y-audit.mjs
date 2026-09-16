import { chromium } from 'playwright'

const url = 'http://localhost:4173/'
const browser = await chromium.launch()

async function withPage(opts, fn) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true, ...opts })
  const page = await context.newPage()
  page.on('pageerror', (e) => console.log('[pageerror]', e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  try {
    await fn(page)
  } finally {
    await context.close()
  }
}

// 1. Headings + landmarks
await withPage({ viewport: { width: 1440, height: 900 } }, async (page) => {
  const headings = await page.$$eval('h1,h2,h3,h4,h5,h6', (els) =>
    els.map((e) => ({ tag: e.tagName, text: e.textContent?.trim().slice(0, 60), visible: !!(e.offsetWidth || e.offsetHeight), srOnly: e.className.includes('sr-only') })),
  )
  console.log('=== HEADINGS ===')
  headings.forEach((h) => console.log(h.tag, h.srOnly ? '(sr-only)' : '', '-', h.text))

  const landmarks = await page.$$eval('header,nav,main,footer,[role]', (els) =>
    els.map((e) => ({ tag: e.tagName, role: e.getAttribute('role'), aria: e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') })),
  )
  console.log('=== LANDMARKS ===')
  landmarks.forEach((l) => console.log(l.tag, l.role || '', l.aria || ''))

  // skip link
  const skip = await page.$('a.skip-link')
  console.log('=== SKIP LINK exists ===', !!skip)
  await page.keyboard.press('Tab')
  const active = await page.evaluate(() => ({ tag: document.activeElement?.tagName, cls: document.activeElement?.className, text: document.activeElement?.textContent?.slice(0,30) }))
  console.log('First tab stop:', active)
})

await browser.close()
