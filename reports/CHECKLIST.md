# Kontrolna lista zahteva — Vodoinstalater Mile

Svaka stavka je označena kao proverena samo uz navedeni dokaz. Automatske provere: `npm run check`, `npm run test:e2e` (Playwright na produkcionom preview-u), `npm run lighthouse`, `node scripts/tour.mjs` (screenshot-ovi svih sekcija). Reprezentativni screenshot-ovi su u `reports/final/`.

Legenda: ✅ provereno · ⚠️ provereno uz napomenu · ❌ nije moglo da se proveri u ovom okruženju

## Tehnička osnova
| Zahtev | Status | Dokaz |
|---|---|---|
| React + Vite + TypeScript + Tailwind, shadcn/ui primitivi (Button, Accordion) | ✅ | `package.json`, `src/components/ui/` |
| Samo `gsap` (+ScrollTrigger) i `lenis` kao animacione biblioteke | ✅ | `package.json` dependencies |
| Bez fotografija i udaljenih slika; sve inline SVG/CSS | ✅ | `grep -r "<img" src` → 0 pogodaka; sve ilustracije u `src/components/svg/` |
| Svi poslovni podaci tipizirani u `src/config/site.ts` i korišćeni u komponentama i metapodacima | ✅ | `vite.config.ts` čita `site.ts` za title/OG/JSON-LD/shell; komponente uvoze `site` |
| `// DEMO` oznake na statistikama i utiscima, diskretna oznaka u sekcijama | ✅ | `site.ts` (komentari), `Trust.tsx`/`Testimonials.tsx` prikazuju `site.demoNote` |
| Telefon prazan → nema `tel:` linkova; dugme se pojavljuje iz konfiguracije | ✅ | e2e „no tel: links“; `Nav.tsx`, `Hero.tsx`, `Contact.tsx` renderuju dugme samo kad `site.phone` nije prazan |
| TypeScript, lint, produkcioni build bez grešaka | ✅ | `npm run check` prolazi (tsc -b, eslint, vite build) |
| Lockfile, jedan package manager (npm) | ✅ | `package-lock.json` |
| Vercel: preset Vite, `npm run build`, `dist`, bez `vercel.json` | ✅ | README; statična jedna stranica bez rutiranja |

## Vizuelni identitet
| Zahtev | Status | Dokaz |
|---|---|---|
| Tačne boje (#07131F, #0E2233, #1E3A52, #EAF2F8, #8FA7BA, #D9823B, #3FC5F0) | ✅ | `src/index.css` `@theme` tokeni |
| Mreža tehničkog crteža, filmsko zrno, meko cijan svetlo | ✅ | `index.css` (`body::before`, `body::after`, `.glow-water`); screenshot-ovi |
| Fontovi Bricolage Grotesque 700–800, Instrument Serif italic, Geist, JetBrains Mono, latin-ext, swap | ⚠️ | `index.html` (Google Fonts preload→stylesheet, `display=swap`); e2e `document.fonts.check` sa „ČćŠžĐ“ prošao u jednom punom prolazu i dijakritike su vidljive na screenshot-ovima; u drugim prolazima sandbox proxy blokira fonts.googleapis.com, pa provera pada iz razloga okruženja |
| `clamp` tipografija do ~9rem, čitljivi naslovi na 360px | ✅ | `.display-xl` = clamp(3rem, 11.5vw, 9rem); screenshot `final/hero-360.png` |
| Kursor: klijent odlučio da ga ne bude | ✅ | uklonjeno iz `App.tsx` |

## Animacioni sistem
| Zahtev | Status | Dokaz |
|---|---|---|
| Jedna neprekinuta bakarna cev uz levu ivicu, savija se ka sekcijama, završava slavinom iznad kontakta | ✅ | `Pipe.tsx`; e2e „pipe path ends at faucet inlet“ (dx 0, dy < 0.01px) na 1440 i 768 |
| Voda se iscrtava `stroke-dashoffset` scrub-om prema ukupnom skrolu; geometrija tačna posle resize/fontova/promene visine | ✅ | `Pipe.tsx` (refreshInit + ResizeObserver + fonts.ready); provera posle resize 1440→420→1280 (agent B) |
| Ispod 768px traka napretka na vrhu | ✅ | e2e „progress bar present / desktop pipe absent“ na 390 i 360 |
| Jedna koordinisana petlja GSAP+Lenis, bez duplih tickera, čišćenje na unmount, StrictMode | ✅ | `ScrollProvider.tsx` (gsap.ticker → lenis.raf, lenis.on('scroll', ScrollTrigger.update), destroy u cleanup); `useGsap` revert |
| Samo transform/opacity osim dozvoljenih izuzetaka | ✅ | pregled koda (recenzent „motion“) |
| `prefers-reduced-motion`: bez pina/scrub-a/Lenis-a/parallax-a, sav sadržaj vidljiv | ✅ | e2e RM: svih 5 anatomskih koraka i 4 koraka procesa vidljivi, kontakt kartica vidljiva, bez Lenis-a, bez visokih sticky omotača; screenshot-ovi `tour-1440-rm`, `tour-390-rm` |

## Sekcije
| Zahtev | Status | Dokaz |
|---|---|---|
| Loader jednom po sesiji, ≤1,2s, preskočen u RM, ne čeka mrežu | ✅ | `Loader.tsx` (0,9s timeline + 1,2s tvrdi limit, sessionStorage); statični shell + preskakanje pri kasnom učitavanju (`intro.ts`), provera `scripts/shell-check.mjs` |
| Nav: sticky staklo, sakrivanje/pojavljivanje bez treperenja, ne skriva se pri tastaturi | ✅ | `Nav.tsx` (ScrollTrigger direction + prag 8px, `header.contains(activeElement)`) |
| Mobilni meni: aria-expanded, fokus, Escape, vraćanje fokusa, zatvaranje na link, zaključavanje skrola | ✅ | e2e na 390 i 360: otvaranje, fokus u meniju, Escape + vraćanje fokusa, link zatvara i skroluje, skrol otključan; dugme za zatvaranje ostaje vidljivo iznad panela (`final/menu-open-390.png`) |
| Hero: tačan tekst, maskirano otkrivanje reči, „Mile rešava.“ serif italic, dva funkcionalna dugmeta | ✅ | e2e „h1 text“, „punchline“, „hero CTAs“, „Pošalji upit reaches contact“ |
| Poverenje: count-up iz konfiguracije, demo oznaka, marquee bez trzaja, bez pomeranja rasporeda | ✅ | `Trust.tsx` (tabular-nums + ch širina); screenshot `final/trust-1440.png` |
| Anatomija: 5 koraka, redosled, razdvajanje, glow, kartica, brojač, tačke, finale, unazad | ✅ | e2e „counter runs 01→05 and back“ (01 02 04 05 05 05 04 01); screenshot-ovi `final/anatomy-*.png` |
| Anatomija mobilno: kraći pin, vertikalno razdvajanje, bez preklapanja na 390x844 i 360x640 | ✅ | screenshot-ovi `tour-390/03-*`, `tour-360/03-*` |
| Usluge: 6 usluga, SVG ikone, otkrivanje, tilt + spotlight samo fini pokazivač | ✅ | `Services.tsx` (`useFinePointer`), screenshot-ovi |
| Kako radim: horizontalna priča na desktopu, vertikalna na mobilnom, statična u RM | ✅ | e2e „process track moves horizontally“; screenshot-ovi `tour-390/05-*`, `tour-1440-rm/05-*` |
| Pre/posle: dve autorske SVG ilustracije, miš/dodir/tastatura, aria vrednost, napomena da nije fotografija | ✅ | e2e „slider keyboard changes value“, „slider drag changes value“ (390, 360); `site.beforeAfter.note` |
| Utisci: dva reda suprotnog smera, pauza na hover/fokus, duplikati aria-hidden, demo oznaka, kontrola pauze | ✅ | e2e „pause control“, „duplicated cards aria-hidden“ |
| Pitanja: pristupačna harmonika, bez izmišljenih cenovnika/sertifikata/rokova | ✅ | e2e „faq button expands + controls panel“; tekstovi u `site.ts` |
| Kontakt: ručica → kap → prskanje → kartica iz prskanja sa overshoot-om; ponavljanje pri ponovnom ulasku | ✅ | `Contact.tsx` (jedan timeline, restart na onEnter/onEnterBack, preskače kad je fokus u kartici); screenshot `final/contact-1440.png` |
| Kontakt: pravi `mailto:`, „Kopiraj“, „Kopirano ✓“ samo posle uspeha, odbijena dozvola → poruka + ručno kopiranje, radno vreme iz konfiguracije, email se prelama na 360px | ✅ | e2e: mailto, kopiranje uspeh (clipboard sadrži email), kopiranje neuspeh (poruka, bez „Kopirano“, email selektovan), „email fits inside the card“ na 390/360 |
| Footer: tekuća godina, naziv iz konfiguracije, povratak na vrh uz RM i Lenis | ✅ | e2e „back to top“ |

## Pristupačnost, SEO, performanse
| Zahtev | Status | Dokaz |
|---|---|---|
| `lang="sr-Latn"`, title „Vodoinstalater Mile \| Beograd“, meta opis, OG, JSON-LD Plumber u isporučenom HTML-u | ✅ | e2e provere na sirovom HTML-u sa preview servera; `dist/index.html` |
| Bez lažnog telefona i demo recenzija u strukturiranim podacima | ✅ | e2e „JSON-LD has no telephone“, „no reviews/ratings“ |
| Jedan H1, link za preskakanje, vidljiv fokus, kontrast AA, mete 44px | ✅ | e2e „single h1“, „first Tab lands on skip link“; Lighthouse pristupačnost 100; dugmad `min-h-11` |
| Bez horizontalnog overflow-a na 360px | ✅ | e2e „no horizontal overflow“ na 360, 390, 768; ture na svim širinama overflow=0 |
| Bez console grešaka i nedostajućih resursa | ⚠️ | e2e bez grešaka sajta; jedini zapisi su padovi Google Fonts zahteva kroz sandbox proxy (okruženje, ne sajt) |
| Lighthouse mobile ≥ 85 na produkcionom build-u | ✅ | `npm run lighthouse` na `vite preview`, poslednji prolaz posle svih popravki: performanse 92, pristupačnost 100, najbolje prakse 100, SEO 100 (FCP 1,7s, LCP 1,7s, TBT 290ms, CLS 0,009); prethodni prolazi 93–94; simulirano 4G/CPU u headless Chromium-u u sandbox-u, nije garancija za svaki uređaj |
| Nezavisni pregled | ✅ | workflow: 4 recenzenta (brief, motion, pristupačnost, vizuelno) + 4 adversarijalna verifikatora; 8 potvrđenih nalaza, svi ispravljeni (vidi dole) |

## Nalazi nezavisnog pregleda (svi ispravljeni)
| Nalaz | Težina | Ispravka |
|---|---|---|
| Produkcioni CSS gubio `backdrop-filter` (ostajao samo `-webkit-` prefiks koji Chrome ne podržava) → staklena navigacija bez zamućenja | visoka | `index.css`: samo neprefiksovana deklaracija, minifikator sam dodaje prefiks; proverena vrednost `blur(18px) saturate(1.2)` u produkciji |
| Navigacija ostaje skrivena kad se fokus tastaturom unese u nju bez skrola | visoka | `Nav.tsx`: `focusin` slušalac vraća header; provereno (y −72 → 0) |
| Ručica pre/posle klizača `visibility:hidden` do otkrivanja → nije u Tab redosledu | visoka | `BeforeAfter.tsx`: otkrivanje samo preko `opacity`; provereno da je fokusabilna pre skrola |
| Wordmark link 32px visok na mobilnom | srednja | `Nav.tsx`: `min-h-11` (44px) |
| Anglicizam „Skroluj“ u uvodu anatomije | srednja | `site.ts`: „Pomerajte stranicu nadole i pogledajte…“ |
| README pominje nepostojeći kursor | niska | uklonjeno |
| Tilt/spotlight kartica meri `getBoundingClientRect` na svaki pointermove | niska | `Services.tsx`: jedno merenje po frejmu (rAF) |
| Glava vode zove `getPointAtLength` na svaki scrub tick | niska | izmereno ~0,27ms po pozivu; ostavljeno, zanemarljivo |
| Marquee se ne pauzira na fokus | odbačeno | u trakama nema fokusabilnih elemenata; postoji dugme pauze |

## Nije izvršeno u ovom okruženju
| Stavka | Razlog |
|---|---|
| Vercel preview/produkcija | Nema Vercel autentifikacije u sesiji; potreban jedan korak: uvoz repozitorijuma na vercel.com/new (preset Vite) ili `npx vercel --prod` |
| Provera na fizičkim uređajima (iOS Safari, Android Chrome) | Samo headless Chromium sa emulacijom dodira |
