import { useRef, type Ref } from 'react'
import { gsap } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useIsMobile, useNearViewport, useReducedMotion } from '@/lib/motion'
import { site, type AnatomyPartId, type AnatomyStep } from '@/config/site'
import { SectionHeader } from '@/components/SectionHeader'
import { AnatomyAssembly } from '@/components/svg/AnatomyAssembly'
import { cn } from '@/lib/utils'

/** Card micro-labels. Business copy lives in site.ts; these three are UI chrome. */
const LABELS = { problem: 'Problem', symptom: 'Simptom', fix: 'Šta Mile radi' } as const

/** Where each part travels when it is taken out of the assembly (SVG user units). */
const EXPLODE: Record<AnatomyPartId, gsap.TweenVars> = {
  gasket: { x: 104, y: -6 },
  pipe: { y: -46 },
  valve: { x: -66 },
  trap: { y: 78 },
  union: { x: 76, y: 54, rotate: 26, svgOrigin: '150 305' },
}

const STEPS = site.anatomy.steps
const STEP_SPAN = 1.4
const FINALE_AT = STEPS.length * STEP_SPAN

function stepNumber(index: number) {
  return `0${index + 1}`
}

function CardBody({ step, compact }: { step: AnatomyStep; compact?: boolean }) {
  return (
    <>
      <h3 className={cn('display-md text-text', compact && 'text-[1.35rem]')}>{step.name}</h3>
      <p className="label-mono mt-3">
        {LABELS.problem} · {LABELS.symptom}
      </p>
      <p className={cn('mt-1 text-text', compact ? 'text-[0.85rem] leading-snug' : 'text-[0.95rem]')}>
        {step.problem} <span className="text-muted">· {step.symptom}</span>
      </p>
      <p className="label-mono mt-3">{LABELS.fix}</p>
      <p className={cn('mt-1 text-muted', compact ? 'text-[0.85rem] leading-snug' : 'text-[0.95rem] leading-relaxed')}>
        {step.fix}
      </p>
    </>
  )
}

function ProgressRow({ counterRef, className }: { counterRef: Ref<HTMLSpanElement>; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-4', className)}>
      <span ref={counterRef} className="font-mono text-sm tracking-[0.08em] text-water">
        {stepNumber(0)}/0{STEPS.length}
      </span>
      <span className="flex gap-2">
        {STEPS.map((step, i) => (
          <span
            key={step.id}
            data-dot=""
            data-state={i === 0 ? 'current' : 'future'}
            className="block h-1.5 w-7 rounded-full bg-line data-[state=current]:bg-water data-[state=past]:bg-water/45"
          />
        ))}
      </span>
    </div>
  )
}

/**
 * "Anatomija kvara": a sticky stage where five parts leave the assembly one by
 * one while their cards cross-fade, and everything returns to place for the
 * finale. CSS sticky reserves the layout; GSAP only scrubs transforms/opacity.
 */
export function Anatomy() {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const near = useNearViewport(sectionRef)

  useGsap(
    () => {
      if (reduced || !near) return
      const wrap = wrapRef.current
      const stage = stageRef.current
      const counter = counterRef.current
      if (!wrap || !stage || !counter) return

      const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-card]'))
      const dots = Array.from(stage.querySelectorAll<HTMLElement>('[data-dot]'))
      const finale = stage.querySelector<HTMLElement>('[data-finale]')
      const assemblyGlow = stage.querySelector<HTMLElement>('[data-assembly-glow]')
      const parts = STEPS.map((step) => ({
        body: stage.querySelector<SVGGElement>(`[data-part="${step.id}"]`),
        light: Array.from(
          stage.querySelectorAll<SVGElement>(`[data-part="${step.id}"] [data-glow], [data-part="${step.id}"] [data-halo]`),
        ),
      }))
      if (cards.length !== STEPS.length || !finale || !assemblyGlow) return
      if (parts.some((part) => !part.body || part.light.length === 0)) return

      gsap.set(cards.slice(1), { opacity: 0, y: 26 })
      gsap.set(finale, { opacity: 0, y: 22 })

      let lastIndex = -1
      let lastFinale: boolean | null = null

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })

      const sync = () => {
        const time = tl.time()
        const index = Math.min(STEPS.length - 1, Math.max(0, Math.floor(time / STEP_SPAN)))
        const inFinale = time >= FINALE_AT + 0.35
        if (index === lastIndex && inFinale === lastFinale) return
        lastIndex = index
        lastFinale = inFinale
        counter.textContent = `${stepNumber(index)}/0${STEPS.length}`
        dots.forEach((dot, i) => {
          dot.dataset.state = inFinale || i < index ? 'past' : i === index ? 'current' : 'future'
        })
        cards.forEach((card, i) => {
          card.setAttribute('aria-hidden', String(inFinale || i !== index))
        })
      }

      STEPS.forEach((step, i) => {
        const at = i * STEP_SPAN
        const { body, light } = parts[i]
        if (!body) return
        tl.addLabel(`step-${i}`, at)
        tl.to(body, { ...EXPLODE[step.id], duration: 0.85, ease: 'power2.out' }, at)
        tl.to(light, { opacity: 1, duration: 0.45 }, at)
        tl.to(cards[i], { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at + 0.1)
        tl.to(body, { x: 0, y: 0, rotate: 0, duration: 0.7, ease: 'power2.inOut' }, at + 1)
        tl.to(light, { opacity: 0, duration: 0.45 }, at + 1)
        // Cards cross-fade: the outgoing one leaves just as the next one arrives.
        tl.to(cards[i], { opacity: 0, y: -20, duration: 0.4 }, i === STEPS.length - 1 ? FINALE_AT : at + STEP_SPAN + 0.05)
      })

      tl.addLabel('finale', FINALE_AT)
      tl.to(assemblyGlow, { opacity: 1, duration: 0.7 }, FINALE_AT)
      tl.to(finale, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, FINALE_AT + 0.35)
      tl.to({}, { duration: 0.35 })
      tl.eventCallback('onUpdate', sync)
      sync()
    },
    [reduced, near, isMobile],
    stageRef,
  )

  if (reduced) {
    return (
      <section id="anatomija" className="container-x scroll-mt-[var(--nav-height)] py-24 md:py-32">
        <SectionHeader index="03" title={site.anatomy.title} intro={site.anatomy.intro} />
        <div className="mt-12 grid items-start gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <AnatomyAssembly className="h-auto w-full max-w-[26rem]" />
          <ol className="grid gap-4">
            {STEPS.map((step, i) => (
              <li key={step.id} className="panel p-5">
                <p className="label-mono mb-2 text-water">
                  {stepNumber(i)}/0{STEPS.length}
                </p>
                <CardBody step={step} />
              </li>
            ))}
          </ol>
        </div>
        <p className="serif-accent display-md mt-12 text-water">{site.anatomy.finale}</p>
      </section>
    )
  }

  return (
    <section id="anatomija" ref={sectionRef} className="relative scroll-mt-[var(--nav-height)]">
      {isMobile ? (
        <div className="container-x pt-20">
          <SectionHeader index="03" title={site.anatomy.title} intro={site.anatomy.intro} />
        </div>
      ) : null}

      <div ref={wrapRef} className={isMobile ? 'relative h-[380vh]' : 'relative h-[520vh]'}>
        <div
          ref={stageRef}
          className="sticky top-0 flex h-svh flex-col overflow-hidden pt-[calc(var(--nav-height)+0.75rem)] pb-6 md:pb-10"
        >
          {isMobile ? null : (
            <div className="container-x">
              <SectionHeader
                index="03"
                title={site.anatomy.title}
                intro={site.anatomy.intro}
                className="[&>h2]:text-[clamp(1.75rem,3vw,2.6rem)] [&>p:first-of-type]:mb-3 [&>p:last-of-type]:mt-3 [&>p:last-of-type]:text-[0.95rem]"
              />
            </div>
          )}

          <div className="container-x flex min-h-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-10 md:pt-6">
            <div className="relative flex min-h-0 flex-1 items-center justify-center md:basis-[55%]">
              <div data-assembly-glow="" className="glow-water" style={{ opacity: 0 }} />
              <AnatomyAssembly className="relative h-full max-h-[min(38svh,300px)] w-auto md:max-h-full" />
            </div>

            <div className="flex flex-none flex-col gap-3 md:min-h-0 md:flex-1 md:basis-[45%] md:justify-center md:gap-5">
              <ProgressRow counterRef={counterRef} />
              <div className="relative min-h-[13.5rem] md:min-h-[17rem]">
                {STEPS.map((step, i) => (
                  <div
                    key={step.id}
                    data-card=""
                    aria-hidden={i !== 0}
                    className={cn(
                      'panel absolute inset-x-0 top-0 p-4 md:p-6',
                      i === 0 ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    <CardBody step={step} compact={isMobile} />
                  </div>
                ))}
                <p
                  data-finale=""
                  className="serif-accent absolute inset-x-0 top-0 text-[clamp(1.75rem,5vw,3rem)] leading-tight text-water opacity-0"
                >
                  {site.anatomy.finale}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
