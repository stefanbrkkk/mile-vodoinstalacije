import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:4173/';

const browser = await chromium.launch();
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    const text = msg.text();
    if (/ERR_TOO_MANY_RETRIES|ERR_CERT_AUTHORITY_INVALID|fonts.googleapis|fonts.gstatic/.test(text)) return;
    consoleErrors.push(text);
  }
});
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const initialCount = await page.evaluate(() => window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 'no-global-ScrollTrigger');
console.log('ScrollTrigger count after load (may be "no-global" if not exposed on window):', initialCount);

// scroll down fully then back up, in steps
const height = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('document height', height);
const steps = 20;
for (let i = 0; i <= steps; i++) {
  await page.mouse.wheel(0, height / steps);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(300);
for (let i = 0; i <= steps; i++) {
  await page.mouse.wheel(0, -height / steps);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(300);

console.log('Console errors after full scroll down+up:', JSON.stringify(consoleErrors, null, 2));

await browser.close();
