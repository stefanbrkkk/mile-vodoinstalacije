import { useId, useRef, useState } from 'react'
import { useOnScreen, useReducedMotion } from '@/lib/motion'
import { site, type Testimonial } from '@/config/site'
import { SectionHeader } from '@/components/SectionHeader'
import { StarRating } from '@/components/svg/Star'
import { cn } from '@/lib/utils'
import './Testimonials.css'

/** Split into two rows of four for the pair of counter-moving marquees. */
const ROWS: { items: Testimonial[]; duration: number; reverse?: boolean }[] = [
  { items: site.testimonials.slice(0, 4), duration: 46 },
  { items: site.testimonials.slice(4), duration: 54, reverse: true },
]

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path d="M7 5v14l12-7Z" fill="currentColor" />
    </svg>
  )
}

function PauseToggle({
  pausedByUser,
  onToggle,
  className,
}: {
  pausedByUser: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={pausedByUser}
      aria-label={pausedByUser ? 'Pokreni utiske' : 'Zaustavi utiske'}
      onClick={onToggle}
      className={cn(
        'h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-ink text-text transition-colors hover:border-water/60',
        className,
      )}
    >
      {pausedByUser ? <PlayIcon /> : <PauseIcon />}
    </button>
  )
}

function TestimonialCard({ t, duplicate }: { t: Testimonial; duplicate?: boolean }) {
  return (
    <li
      aria-hidden={duplicate ? 'true' : undefined}
      className="panel flex w-[19rem] shrink-0 flex-col gap-4 p-6 sm:w-[22rem]"
    >
      <StarRating rating={t.rating} />
      <p className="text-[0.95rem] leading-relaxed text-text">{t.text}</p>
      <div className="mt-auto">
        <p className="display-md text-[1.15rem] text-text">{t.name}</p>
        <p className="label-mono mt-1">{t.area}</p>
      </div>
    </li>
  )
}

function MarqueeRow({ items, duration, reverse, paused }: (typeof ROWS)[number] & { paused: boolean }) {
  const track = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <ul
        data-paused={paused ? 'true' : 'false'}
        data-reverse={reverse ? 'true' : 'false'}
        style={{ animationDuration: `${duration}s` }}
        className="testimonial-track flex w-max items-stretch gap-5 pr-5"
      >
        {track.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} duplicate={i >= items.length} />
        ))}
      </ul>
    </div>
  )
}

/**
 * "Utisci": two counter-scrolling rows of demo reviews. Pauses on hover, off-screen, and via
 * an explicit pause/play button (shown once per breakpoint: inline with the title on md+,
 * below the demo note on mobile). Reduced motion swaps the whole thing for a static grid.
 */
export function Testimonials() {
  const reducedMotion = useReducedMotion()
  const headingId = useId()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [pausedByUser, setPausedByUser] = useState(false)
  const onScreen = useOnScreen(wrapRef)
  const paused = hovered || pausedByUser || !onScreen
  const toggle = () => setPausedByUser((v) => !v)

  return (
    <section
      id="utisci"
      className="container-x scroll-mt-[var(--nav-height)] py-24 md:py-32"
      aria-labelledby={headingId}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
        <SectionHeader index="07" id={headingId} title={site.nav[2].label} />
        {reducedMotion ? null : (
          <PauseToggle pausedByUser={pausedByUser} onToggle={toggle} className="hidden md:mb-1 md:flex" />
        )}
      </div>
      <p className="label-mono mt-3">{site.demoNote}</p>
      {reducedMotion ? null : (
        <PauseToggle pausedByUser={pausedByUser} onToggle={toggle} className="mt-3 flex md:hidden" />
      )}

      {reducedMotion ? (
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {site.testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </ul>
      ) : (
        <div
          ref={wrapRef}
          className="relative mt-10 flex flex-col gap-5 overflow-hidden py-2"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {ROWS.map((row) => (
            <MarqueeRow key={row.duration} {...row} paused={paused} />
          ))}
        </div>
      )}
    </section>
  )
}
