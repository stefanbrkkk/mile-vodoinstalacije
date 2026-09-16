// Runs Lighthouse (mobile) against the production preview. Usage: node scripts/lighthouse.mjs [url]
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'

const url = process.argv[2] ?? 'http://localhost:4173/'
mkdirSync('reports', { recursive: true })
const chrome =
  process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const out = 'reports/lighthouse-mobile'
const args = [
  '--yes',
  'lighthouse@13',
  url,
  '--preset=perf',
  '--only-categories=performance,accessibility,best-practices,seo',
  '--form-factor=mobile',
  '--screenEmulation.mobile',
  '--throttling-method=simulate',
  `--output=json,html`,
  `--output-path=${out}`,
  '--chrome-flags=--headless=new --no-sandbox --ignore-certificate-errors',
  '--quiet',
]
const child = spawn('npx', args, { stdio: 'inherit', env: { ...process.env, CHROME_PATH: chrome } })
child.on('exit', (code) => {
  if (code !== 0) process.exit(code ?? 1)
  const json = JSON.parse(readFileSync(`${out}.report.json`, 'utf8'))
  const cats = json.categories
  const audits = json.audits
  const pick = (id) => audits[id]?.displayValue ?? audits[id]?.numericValue
  console.log(
    JSON.stringify(
      {
        url,
        performance: Math.round(cats.performance.score * 100),
        accessibility: Math.round(cats.accessibility.score * 100),
        bestPractices: Math.round(cats['best-practices'].score * 100),
        seo: Math.round(cats.seo.score * 100),
        fcp: pick('first-contentful-paint'),
        lcp: pick('largest-contentful-paint'),
        tbt: pick('total-blocking-time'),
        cls: pick('cumulative-layout-shift'),
        speedIndex: pick('speed-index'),
      },
      null,
      1,
    ),
  )
})
