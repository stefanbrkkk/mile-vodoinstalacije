import { useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useOnScreen, useReducedMotion } from '@/lib/motion'
import { site } from '@/config/site'
import { Drop } from '@/components/svg/Drop'
import './Trust.css'

const numberFormatter = new Intl.NumberFormat('sr-RS')

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

export function Trust() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([])
  const marqueeRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [pausedByUser, setPausedByUser] = useState(false)
  const onScreen = useOnScreen(marqueeRef)
  const marqueePaused = hovered || pausedByUser || !onScreen

  // Count 0 -> value once, when the stats row enters the viewport.
  useGsap(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        site.stats.forEach((stat, i) => {
          const el = statRefs.current[i]
          if (!el) return
          const counter = { value: 0 }
          gsap.to(counter, {
            value: stat.value,
            duration: 1.6,
            ease: 'expo.out',
            snap: { value: 1 },
            onUpdate: () => {
              el.textContent = `${stat.prefix ?? ''}${numberFormatter.format(counter.value)}${stat.suffix ?? ''}`
            },
          })
        })
      },
    })

    return () => trigger.kill()
  }, [reducedMotion])

  const services = site.services.map((service) => service.title)

  return (
    <section id="poverenje" ref={sectionRef} className="container-x scroll-mt-[var(--nav-height)] py-24">
      <h2 className="sr-only">Poverenje</h2>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {site.stats.map((stat, i) => {
          const finalString = `${stat.prefix ?? ''}${numberFormatter.format(stat.value)}${stat.suffix ?? ''}`
          const initialString = reducedMotion ? finalString : `${stat.prefix ?? ''}0${stat.suffix ?? ''}`
          return (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              <div className="font-mono text-[clamp(2.5rem,6vw,5rem)] leading-none font-medium tabular-nums text-text">
                <span
                  ref={(el) => {
                    statRefs.current[i] = el
                  }}
                  aria-hidden={reducedMotion ? undefined : true}
                  style={{ minWidth: `${finalString.length}ch` }}
                  className="inline-block"
                >
                  {initialString}
                </span>
                {!reducedMotion ? <span className="sr-only">{finalString}</span> : null}
              </div>
              <p className="text-sm text-muted md:text-base">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <p className="label-mono mt-10 text-center sm:text-left">{site.demoNote}</p>

      <div className="mt-16">
        {reducedMotion ? (
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:justify-start" aria-label="Usluge">
            {services.map((title) => (
              <li key={title} className="label-mono">
                {title}
              </li>
            ))}
          </ul>
        ) : (
          <div
            ref={marqueeRef}
            className="relative overflow-hidden py-2"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <div
              data-paused={marqueePaused ? 'true' : 'false'}
              className="trust-marquee-track flex w-max items-center gap-8 pr-16"
            >
              {[...services, ...services].map((title, i) => (
                <span
                  key={i}
                  className="flex items-center gap-8"
                  aria-hidden={i >= services.length ? 'true' : undefined}
                >
                  <span className="label-mono whitespace-nowrap text-text/80">{title}</span>
                  <Drop className="h-3 w-3 text-copper" />
                </span>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={pausedByUser}
              aria-label={pausedByUser ? 'Pokreni traku' : 'Zaustavi traku'}
              onClick={() => setPausedByUser((v) => !v)}
              className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-line bg-ink text-text shadow-[0_0_24px_10px_rgb(7_19_31)]"
            >
              {pausedByUser ? <PlayIcon /> : <PauseIcon />}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
