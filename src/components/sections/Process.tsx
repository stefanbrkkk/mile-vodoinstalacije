import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useIsMobile, useNearViewport, useReducedMotion } from '@/lib/motion'
import { site, type ProcessStep } from '@/config/site'
import { SectionHeader } from '@/components/SectionHeader'
import { ProcessGlyph, type GlyphKind } from '@/components/svg/ProcessGlyph'
import { cn } from '@/lib/utils'

/** Glyph per step, in the order the steps are listed in the config. */
const GLYPHS: GlyphKind[] = ['contact', 'diagnose', 'repair', 'warranty']
const STEPS = site.process.steps

function stepNumber(index: number) {
  return `0${index + 1}`
}

function Panel({
  step,
  index,
  className,
  layout = 'stack',
  active = false,
}: {
  step: ProcessStep
  index: number
  className?: string
  /** 'stack': drawing under the number (track panel). 'row': drawing beside it (list). */
  layout?: 'stack' | 'row'
  /** Reduced motion shows every step already reached by the water line. */
  active?: boolean
}) {
  const glyph = GLYPHS[index] ?? 'repair'
  return (
    <article
      data-panel=""
      data-state={active ? 'on' : 'off'}
      className={cn('panel group relative flex flex-col p-6 data-[state=on]:border-water/45 md:p-7', className)}
    >
      {layout === 'stack' ? (
        <>
          <span className="font-mono text-3xl leading-none text-muted/60 group-data-[state=on]:text-water md:text-4xl">
            {stepNumber(index)}
          </span>
          <ProcessGlyph kind={glyph} className="mx-auto my-5 size-[6.5rem] md:size-28" />
        </>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-3xl leading-none text-muted/60 group-data-[state=on]:text-water md:text-4xl">
            {stepNumber(index)}
          </span>
          <ProcessGlyph kind={glyph} className="size-[72px] shrink-0" />
        </div>
      )}
      <h3 className={cn('display-md text-text', layout === 'row' && 'mt-4')}>{step.title}</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.description}</p>
    </article>
  )
}

/**
 * "Kako radim": four steps told as a horizontal track on desktop (CSS sticky
 * stage, scrubbed x) and as a vertical story with a filling water line on
 * mobile. Reduced motion always gets the vertical list, fully filled.
 */
export function Process() {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const waterRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const near = useNearViewport(sectionRef)
  const vertical = reduced || isMobile

  useGsap(
    () => {
      if (reduced || !near) return
      const water = waterRef.current
      if (!water) return

      if (vertical) {
        const list = listRef.current
        if (!list) return
        const panels = Array.from(list.querySelectorAll<HTMLElement>('[data-panel]'))
        gsap.set(water, { scaleY: 0 })
        let marks: number[] = []
        const measure = () => {
          const listRect = list.getBoundingClientRect()
          marks = panels.map((panel) => {
            const rect = panel.getBoundingClientRect()
            return (rect.top - listRect.top + rect.height * 0.35) / Math.max(1, listRect.height)
          })
        }
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: list,
            start: 'top 72%',
            end: 'bottom 65%',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: measure,
          },
        })
        tl.fromTo(water, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 }, 0)
        tl.eventCallback('onUpdate', () => {
          const progress = tl.progress()
          panels.forEach((panel, i) => {
            panel.dataset.state = progress >= (marks[i] ?? 1) ? 'on' : 'off'
          })
        })
        measure()
        return
      }

      const wrap = wrapRef.current
      const stage = stageRef.current
      const track = trackRef.current
      const rail = railRef.current
      if (!wrap || !stage || !track || !rail) return
      const panels = Array.from(track.querySelectorAll<HTMLElement>('[data-panel]'))
      const shift = () => Math.max(0, track.offsetWidth - stage.clientWidth)

      gsap.set(track, { x: 0 })
      gsap.set(water, { scaleX: 0 })
      let marks: number[] = []
      const measure = () => {
        marks = panels.map(
          (panel) => (panel.offsetLeft - rail.offsetLeft + panel.offsetWidth * 0.42) / Math.max(1, rail.offsetWidth),
        )
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: measure,
        },
      })
      tl.to(track, { x: () => -shift(), ease: 'none', duration: 1 }, 0)
      tl.fromTo(water, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
      tl.eventCallback('onUpdate', () => {
        const progress = tl.progress()
        panels.forEach((panel, i) => {
          panel.dataset.state = progress >= (marks[i] ?? 1) ? 'on' : 'off'
        })
      })
      measure()
    },
    [reduced, near, vertical],
    sectionRef,
  )

  if (vertical) {
    return (
      <section id="kako-radim" ref={sectionRef} className="container-x scroll-mt-[var(--nav-height)] py-20 md:py-28">
        <SectionHeader index="05" title={site.process.title} />
        <ol ref={listRef} className="relative mt-10 grid gap-6 pl-9">
          <div aria-hidden="true" className="absolute top-3 bottom-3 left-[9px] w-[3px] rounded-full bg-copper/40">
            <div
              ref={waterRef}
              className="h-full w-full origin-top rounded-full bg-water"
              style={{ transform: reduced ? 'scaleY(1)' : 'scaleY(0)' }}
            />
          </div>
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-8 -left-9 size-[19px] translate-x-[1px] rounded-full border-2 border-copper bg-ink"
              />
              <Panel step={step} index={i} layout="row" active={reduced} />
            </li>
          ))}
        </ol>
      </section>
    )
  }

  return (
    <section id="kako-radim" ref={sectionRef} className="relative scroll-mt-[var(--nav-height)]">
      <div ref={wrapRef} className="relative h-[300vh]">
        <div
          ref={stageRef}
          className="sticky top-0 flex h-svh flex-col overflow-hidden pt-[calc(var(--nav-height)+1.25rem)] pb-12"
        >
          <div className="container-x">
            <SectionHeader
              index="05"
              title={site.process.title}
              className="[&>h2]:text-[clamp(1.75rem,3vw,2.6rem)] [&>p:first-of-type]:mb-3"
            />
          </div>
          <div className="relative flex min-h-0 flex-1 items-center">
            <div
              ref={trackRef}
              className="flex w-max flex-col gap-8"
              style={{ paddingLeft: 'calc(var(--gutter) + var(--pipe-x))', paddingRight: '14vw' }}
            >
              <div className="flex items-start gap-6">
                {STEPS.map((step, i) => (
                  <Panel
                    key={step.title}
                    step={step}
                    index={i}
                    className="w-[min(62vw,520px)] shrink-0"
                  />
                ))}
              </div>
              <div ref={railRef} className="relative h-[3px] w-full rounded-full bg-copper/35">
                <div
                  ref={waterRef}
                  className="h-full w-full origin-left rounded-full bg-water"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
