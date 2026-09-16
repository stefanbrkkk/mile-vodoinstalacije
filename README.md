# Vodoinstalater Mile — demo sajt

Jednostrani, statični demo sajt za lokalnog vodoinstalatera iz Beograda. React 19 + Vite 8 + TypeScript + Tailwind CSS 4, animacije preko GSAP ScrollTrigger-a i Lenis-a. Bez backend-a, baze i API ključeva.

## Pokretanje

```bash
npm install
npm run dev        # lokalni razvoj (http://localhost:5173)
npm run typecheck  # TypeScript provera
npm run lint       # ESLint
npm run build      # produkcioni build u dist/
npm run preview    # pregled produkcionog build-a
npm run check      # typecheck + lint + build
```

Provere u browseru (Playwright, Chromium je već instaliran u okruženju):

```bash
node scripts/shot.mjs http://localhost:5173 --w 390 --h 844 --touch --scroll "#kontakt" --out reports/kontakt.png
npm run test:e2e   # automatizovane provere na produkcionom preview-u
npm run lighthouse # Lighthouse mobile na produkcionom build-u (reports/lighthouse-mobile.html)
```

## Gde se menjaju poslovni podaci

Sve što je vidljivo na sajtu (naziv, grad, mejl, telefon, radno vreme, usluge, koraci, pitanja, statistike, utisci, tekstovi sekcija) je u jednom fajlu:

```
src/config/site.ts
```

- `phone` je prazan: kada unesete broj, dugmad „Pozovi“ se sama pojavljuju u navigaciji, hero sekciji i kontaktu.
- `url` je prazan: kada znate produkcioni domen, upišite ga i biće uključen u Open Graph i JSON-LD metapodatke.
- Polja označena sa `// DEMO` (statistike i utisci) su ilustrativni primeri i na sajtu su diskretno označena kao demo podaci.

Naslov stranice, meta opis, Open Graph tagovi i JSON-LD `Plumber` se generišu iz tog fajla u vreme build-a (Vite plugin u `vite.config.ts`), pa postoje u isporučenom HTML-u bez klijentskog JavaScript-a.

## Objava na Vercel

Projekat je običan statični Vite frontend.

1. Uvezite repozitorijum na [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite**. Build komanda: `npm run build`. Output direktorijum: `dist`. Install komanda: `npm install`.
3. Nema promenljivih okruženja ni tajni. `vercel.json` nije potreban (jedna stranica sa sidrima, bez rutiranja).

Ili iz terminala:

```bash
npx vercel          # preview
npx vercel --prod   # produkcija
```

## Struktura

```
src/config/site.ts        poslovni podaci i tekstovi (jedini izvor istine)
src/lib/                  scroll sistem (Lenis + ScrollTrigger), GSAP hook, media upiti
src/components/           navigacija, cev, loader, kursor, UI primitivi
src/components/sections/  sekcije stranice, redom kao na sajtu
src/components/svg/       autorske SVG ilustracije i ikone
scripts/                  screenshot, e2e i Lighthouse pomoćni skriptovi
```

## Pristupačnost i pokret

- `prefers-reduced-motion` daje punu statičnu verziju: bez smooth-scroll-a, pinovanja, scrub-a i neprekidnih pokreta; sav sadržaj je odmah vidljiv.
- Ispod 768px cev uz levu ivicu zamenjuje tanka traka napretka na vrhu.
- Link za preskakanje navigacije, vidljiv fokus, dodirne mete od najmanje 44px.
