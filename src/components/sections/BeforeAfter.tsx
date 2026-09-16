import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useReducedMotion } from '@/lib/motion'
import { site } from '@/config/site'
import { SectionHeader } from '@/components/SectionHeader'
import { BeforeAfterScene } from '@/components/svg/BeforeAfterScene'

const MIN = 0
const MAX = 100
const STEP = 2
const PAGE_STEP = 10

function clamp(value: number) {
  return Math.min(MAX, Math.max(MIN, value))
}

/**
 * "Pre i posle": a draggable/keyboard comparison slider over two matching illustrations.
 * `value` (0–100, % of "after" revealed) is the single source of truth: the before layer's
 * clip and the handle's position are both derived from it, so they can never drift apart.
 */
export function BeforeAfter() {
  const reducedMotion = useReducedMotion()
  const headingId = useId()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const handleRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const [value, setValue] = useState(50)

  useGsap(() => {
    if (reducedMotion) return
    const el = wrapRef.current
    if (!el) return
    gsap.set(el, { autoAlpha: 0, y: 24 })
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }),
    })
    return () => trigger.kill()
  }, [reducedMotion])

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const handlePercent = clamp(((clientX - rect.left) / rect.width) * 100)
    setValue(clamp(100 - handlePercent))
  }, [])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
    handleRef.current?.focus()
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    updateFromClientX(e.clientX)
  }
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Capture may already be released; safe to ignore.
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number
    if (e.key === 'ArrowLeft') next = value - STEP
    else if (e.key === 'ArrowRight') next = value + STEP
    else if (e.key === 'Home') next = MIN
    else if (e.key === 'End') next = MAX
    else if (e.key === 'PageUp') next = value + PAGE_STEP
    else if (e.key === 'PageDown') next = value - PAGE_STEP
    else return
    e.preventDefault()
    setValue(clamp(next))
  }

  const rounded = Math.round(value)
  const handlePercent = 100 - rounded

  return (
    <section
      id="pre-posle"
      className="container-x scroll-mt-[var(--nav-height)] py-24 md:py-32"
      aria-labelledby={headingId}
    >
      <SectionHeader index="06" id={headingId} title={site.beforeAfter.title} intro={site.beforeAfter.intro} />

      <div ref={wrapRef} className="mt-12">
        <div
          ref={trackRef}
          className="relative aspect-[8/5] w-full touch-none overflow-hidden rounded-lg border border-line select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <BeforeAfterScene variant="after" className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 h-full w-full" style={{ clipPath: `inset(0 ${rounded}% 0 0)` }}>
            <BeforeAfterScene variant="before" className="h-full w-full" />
          </div>

          <span className="label-mono pointer-events-none absolute top-3 left-3 rounded-md border border-line bg-ink/80 px-2 py-1 text-text/90">
            {site.beforeAfter.beforeLabel}
          </span>
          <span className="label-mono pointer-events-none absolute top-3 right-3 rounded-md border border-line bg-ink/80 px-2 py-1 text-text/90">
            {site.beforeAfter.afterLabel}
          </span>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-px bg-water/70"
            style={{ left: `${handlePercent}%` }}
          />

          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={site.beforeAfter.sliderLabel}
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={rounded}
            aria-valuetext={`${rounded}% ${site.beforeAfter.afterLabel}`}
            onKeyDown={onKeyDown}
            style={{ left: `${handlePercent}%` }}
            className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-copper bg-ink shadow-[0_0_0_4px_rgb(7_19_31)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
          >
            <span aria-hidden="true" className="flex gap-[3px]">
              <span className="h-4 w-[2px] rounded-full bg-copper" />
              <span className="h-4 w-[2px] rounded-full bg-copper" />
            </span>
          </div>
        </div>

        <p className="label-mono mt-4">{site.beforeAfter.note}</p>
      </div>
    </section>
  )
}
