import { chromium } from 'playwright'

const browser = await chromium.launch()
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 900 } })
const page = await context.newPage()
const failures = []
const assert = (cond, msg) => { if (!cond) failures.push(msg); }

await page.goto('http://localhost:5174', { waitUntil: 'networkidle' })

// --- BeforeAfter slider ---
await page.evaluate(() => document.querySelector('#pre-posle')?.scrollIntoView())
await page.waitForTimeout(300)
const slider = page.locator('#pre-posle [role="slider"]')
const before1 = await slider.getAttribute('aria-valuenow')
await slider.focus()
await page.keyboard.press('ArrowRight')
const after1 = await slider.getAttribute('aria-valuenow')
assert(before1 !== after1, `slider ArrowRight should change aria-valuenow (was ${before1}, still ${after1})`)

const track = page.locator('#pre-posle .relative.aspect-\\[8\\/5\\]')
const box = await track.boundingBox()
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)
await page.mouse.down()
await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5, { steps: 10 })
await page.mouse.up()
const afterDrag = await slider.getAttribute('aria-valuenow')
assert(afterDrag !== after1, `drag should change aria-valuenow (was ${after1}, still ${afterDrag})`)

await slider.focus()
await page.keyboard.press('Home')
assert((await slider.getAttribute('aria-valuenow')) === '0', 'Home should set aria-valuenow to 0')
await page.keyboard.press('End')
assert((await slider.getAttribute('aria-valuenow')) === '100', 'End should set aria-valuenow to 100')

// move mouse away from any tracked container before the next sections
await page.mouse.move(5, 5)

// --- FAQ accordion ---
await page.evaluate(() => document.querySelector('#pitanja')?.scrollIntoView())
await page.waitForTimeout(300)
const trigger = page.locator('#pitanja button[aria-expanded]').first()
const expandedBefore = await trigger.getAttribute('aria-expanded')
await trigger.click()
await page.waitForTimeout(400)
const expandedAfter = await trigger.getAttribute('aria-expanded')
assert(expandedBefore !== expandedAfter, `FAQ trigger aria-expanded should toggle (was ${expandedBefore}, still ${expandedAfter})`)
const controlsId = await trigger.getAttribute('aria-controls')
const panel = page.locator(`[id="${controlsId}"]`)
assert(await panel.isVisible(), 'FAQ panel should become visible after expanding')

await page.mouse.move(5, 5)

// --- Testimonials pause toggle (isolated from hover-pause by moving the mouse away) ---
await page.evaluate(() => document.querySelector('#utisci')?.scrollIntoView())
await page.waitForTimeout(300)
await page.mouse.move(5, 5)
const toggle = page.locator('#utisci button[aria-pressed]')
const track1 = page.locator('#utisci .testimonial-track').first()

const pressedBefore = await toggle.getAttribute('aria-pressed')
const stateBaseline = await track1.evaluate((el) => getComputedStyle(el).animationPlayState)
assert(stateBaseline === 'running', `baseline (mouse away) should be running, was ${stateBaseline}`)

await toggle.click()
await page.mouse.move(5, 5)
const pressedAfter = await toggle.getAttribute('aria-pressed')
const stateAfter = await track1.evaluate((el) => getComputedStyle(el).animationPlayState)
assert(pressedBefore !== pressedAfter, `testimonials toggle aria-pressed should flip (was ${pressedBefore}, still ${pressedAfter})`)
assert(stateAfter === 'paused', `after pausing by user (mouse away), track should be paused, was ${stateAfter}`)

await toggle.click()
await page.mouse.move(5, 5)
const stateResumed = await track1.evaluate((el) => getComputedStyle(el).animationPlayState)
assert(stateResumed === 'running', `after un-pausing (mouse away), track should resume running, was ${stateResumed}`)

await browser.close()

if (failures.length) {
  console.log('FAILURES:\n' + failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('ALL INTERACTION CHECKS PASSED')
}
