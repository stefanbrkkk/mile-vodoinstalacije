# Vodoinstalater Mile — project conventions

Single-page demo site (React 19 + Vite 8 + TypeScript + Tailwind 4). Frontend only, static, deployed to Vercel.

## Hard constraints
- Animation libraries: only `gsap` (+ ScrollTrigger) and `lenis`. No Framer Motion, Three.js, WebGL, no other motion libs.
- No photos, no remote images. All visuals are inline SVG, CSS and gradients.
- Every business string/number comes from `src/config/site.ts` (typed). Do not hardcode copy in components.
- Visible text: natural Serbian, Latin script, ekavica, no anglicisms. Code, comments and identifiers in English.
- Animate only `transform` and `opacity`. Allowed exceptions: SVG water via `stroke-dashoffset`, small local SVG turbulence, accordion height. Never animate filters/blur across the page.
- `prefers-reduced-motion`: full experience with final states shown, no pinning, no scrub, no Lenis, no continuous motion, all content visible and usable.
- All content must be in the DOM and readable even if no animation ever runs (animations only add transform/opacity on top).
- Phone is empty in config: never render call buttons or empty `tel:` links; render them only when `site.phone` is non-empty.

## Layout & motion architecture
- `ScrollProvider` (`src/lib/ScrollProvider.tsx`) creates one Lenis instance driven by `gsap.ticker`, forwards scroll to `ScrollTrigger.update`, debounces refresh, and handles every `<a href="#id">` click globally (smooth scroll + hash + focus). Do not add your own anchor scroll handlers or a second rAF loop.
- `useScroll()` (`src/lib/scroll-context.ts`) → `{ scrollTo, requestRefresh, lock, unlock, getLenis, reducedMotion }`.
- `useGsap(setup, deps, scopeRef)` (`src/lib/useGsap.ts`) wraps `gsap.context` + revert on cleanup. Put all GSAP code there. Event handlers that create tweens must be created inside the setup and removed in the returned cleanup.
- Hooks in `src/lib/motion.ts`: `useReducedMotion`, `useIsMobile` (<768px), `useFinePointer`, `useNearViewport(ref)` (defer heavy setup until close), `useOnScreen(ref)` (pause off-screen loops).
- Pinned sections use CSS sticky, not GSAP `pin: true`: an outer wrapper with an explicit height (e.g. `h-[400vh]`) and an inner `sticky top-0 h-svh` stage; a scrubbed timeline uses the wrapper as trigger (`start: 'top top'`, `end: 'bottom bottom'`). This reserves layout, survives lazy init and resize, and never creates pin spacers.
- Desktop (≥768px) leaves a left strip for the copper pipe: `.container-x` already pads for `--pipe-x`. Do not paint opaque full-width backgrounds over that strip.
- `nav` height is `--nav-height` (72px). Sections are `<section id="…">` with `scroll-mt-[var(--nav-height)]` where a nav link targets them.

## Design tokens (Tailwind theme, `src/index.css`)
- Colors: `ink` #07131F (bg), `surface` #0E2233, `line` #1E3A52, `text` #EAF2F8, `muted` #8FA7BA, `copper` #D9823B, `water` #3FC5F0. Use them as `bg-ink`, `text-muted`, `border-line`, `text-water`, etc.
- Fonts: `font-display` (Bricolage Grotesque 700/800), `font-serif` (Instrument Serif italic, use with `.serif-accent`), `font-sans` (Geist), `font-mono` (JetBrains Mono).
- Helper classes: `.container-x`, `.display-xl`, `.display-lg`, `.display-md`, `.serif-accent`, `.label-mono`, `.glass`, `.panel`, `.glow-water`, `.gpu`. Radius 8px (`rounded-md`), 1px lines.
- Copper buttons use dark ink text (`text-ink`) for contrast; `Button` in `src/components/ui/button.tsx` (variants primary/outline/ghost, sizes default/lg/icon).
- Shared `SectionHeader` in `src/components/SectionHeader.tsx` for consistent section titles.
- Variants: `motion-safe:` / `motion-reduce:` and custom `motion-ok:` (no-preference).

## Accessibility & quality floor
- One `<h1>` (hero). Each section has an `h2`. Decorative SVG: `aria-hidden="true" focusable="false"`. Functional graphics: `role="img"` + `aria-label`.
- Touch targets ≥ 44px; visible focus (global `:focus-visible` style); WCAG AA contrast.
- No horizontal overflow at 360px. Never fix widths by hiding page overflow.
- Duplicated marquee items: `aria-hidden="true"` on the duplicate copy.

## Scripts
- `npm run dev`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run preview`, `npm run check` (all three).
- Screenshots / console check: `node scripts/shot.mjs <url> [--w 1440] [--h 900] [--scroll 1200|#id] [--rm] [--touch] [--full] [--out reports/x.png]`.
