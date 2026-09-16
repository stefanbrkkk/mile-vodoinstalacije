import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useIsMobile, useReducedMotion } from '@/lib/motion'
import { site } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Faucet } from '@/components/svg/Faucet'
import { FAUCET_INLET, FAUCET_PIVOT, FAUCET_SPOUT, FAUCET_VIEW } from '@/components/svg/pipe-style'

type CopyStatus = 'idle' | 'copied' | 'failed'

/** Burst directions for the splash droplets, in faucet user units. */
const SPLASH_VECTORS = [
  { x: -34, y: -26 },
  { x: -20, y: -38 },
  { x: -8, y: -18 },
  { x: 10, y: -40 },
  { x: 24, y: -28 },
  { x: 36, y: -14 },
]

const MAX_BURST_DROPS = 30

/**
 * Finale: the pipe ends in a copper tap, the handle opens, a drop falls and the
 * contact card springs out of the splash. Reduced motion renders the same scene
 * in its final state with no timeline and no ScrollTrigger.
 */
export function Contact() {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const faucetRef = useRef<HTMLDivElement>(null)
  const cardWrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const burstRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLAnchorElement>(null)
  const statusTimer = useRef<number | null>(null)
  const [status, setStatus] = useState<CopyStatus>('idle')

  const phone: string = site.phone
  const message = status === 'copied' ? site.contact.copiedLabel : status === 'failed' ? site.contact.copyFailed : ''

  useEffect(() => {
    return () => {
      if (statusTimer.current !== null) window.clearTimeout(statusTimer.current)
    }
  }, [])

  const announce = useCallback((next: CopyStatus) => {
    setStatus(next)
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current)
    statusTimer.current = window.setTimeout(() => setStatus('idle'), next === 'copied' ? 2400 : 8000)
  }, [])

  const selectEmail = useCallback(() => {
    const node = emailRef.current
    const selection = window.getSelection?.()
    if (!node || !selection) return
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(site.email)
      announce('copied')
    } catch {
      announce('failed')
      selectEmail()
    }
  }, [announce, selectEmail])

  useGsap(
    () => {
      const section = sectionRef.current
      const faucet = faucetRef.current
      const cardWrap = cardWrapRef.current
      const card = cardRef.current
      const layer = burstRef.current
      if (!section || !faucet || !cardWrap || !card || !layer) return

      const handle = faucet.querySelector<SVGGElement>('[data-faucet-handle]')
      const drop = faucet.querySelector<SVGGElement>('[data-drop]')
      const splash = faucet.querySelector<SVGGElement>('[data-splash]')
      const rings = Array.from(faucet.querySelectorAll<SVGElement>('[data-splash-ring]'))
      const splashDrops = Array.from(faucet.querySelectorAll<SVGElement>('[data-splash-drop]'))
      const items = Array.from(card.querySelectorAll<HTMLElement>('[data-card-item]'))
      if (!handle || !drop || !splash || rings.length === 0 || splashDrops.length === 0) return

      if (reduced) {
        gsap.set(handle, { rotate: 70, svgOrigin: FAUCET_PIVOT })
        return
      }

      // Measured from untransformed layout boxes, so a replay never compounds.
      let fall = 120
      let splashY = 160
      const place = () => {
        const scale = faucet.offsetWidth / FAUCET_VIEW.width || 1
        const spoutTop = faucet.offsetTop + FAUCET_SPOUT.y * scale
        fall = Math.max(40, (cardWrap.offsetTop - spoutTop) / scale)
        splashY = (cardWrap.offsetTop - faucet.offsetTop) / scale
        const originX = faucet.offsetLeft + FAUCET_SPOUT.x * scale - cardWrap.offsetLeft
        gsap.set(card, { transformOrigin: `${originX.toFixed(1)}px 0px` })
        gsap.set(splash, { x: FAUCET_SPOUT.x, y: splashY })
      }

      const tl = gsap.timeline({ paused: true })
      tl.fromTo(
        handle,
        { rotate: 0 },
        { rotate: 70, duration: 0.55, ease: 'back.out(2.4)', svgOrigin: FAUCET_PIVOT },
        0,
      )
      tl.fromTo(drop, { opacity: 0, y: 0, scaleY: 1 }, { opacity: 1, duration: 0.14 }, 0.3)
      tl.to(drop, { y: () => fall, scaleY: 1.4, duration: 0.44, ease: 'power2.in' }, 0.36)
      tl.set(drop, { opacity: 0 }, 0.8)
      tl.set(splash, { opacity: 1 }, 0.78)
      tl.fromTo(
        rings,
        { scale: 0.25, opacity: 0.85 },
        { scale: 3.6, opacity: 0, duration: 0.62, stagger: 0.12, ease: 'power2.out', transformOrigin: '50% 50%' },
        0.78,
      )
      tl.fromTo(
        splashDrops,
        { x: 0, y: 0, scale: 0.5, opacity: 1 },
        {
          x: (i: number) => SPLASH_VECTORS[i % SPLASH_VECTORS.length].x,
          y: (i: number) => SPLASH_VECTORS[i % SPLASH_VECTORS.length].y,
          scale: 1,
          opacity: 0,
          duration: 0.58,
          ease: 'power2.out',
        },
        0.78,
      )
      tl.set(splash, { opacity: 0 }, 1.45)
      tl.fromTo(
        card,
        { scale: 0.6, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)' },
        0.94,
      )
      if (items.length) {
        tl.fromTo(
          items,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' },
          1.2,
        )
      }

      const play = () => {
        if (card.contains(document.activeElement)) return
        place()
        tl.invalidate()
        tl.restart()
      }

      place()
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        onEnter: play,
        onEnterBack: play,
        onRefresh: place,
      })

      let active = 0
      const onPointerDown = (event: PointerEvent) => {
        const rect = layer.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const count = 6 + Math.floor(Math.random() * 5)
        for (let i = 0; i < count; i += 1) {
          if (active >= MAX_BURST_DROPS) break
          const dot = document.createElement('span')
          const size = 3 + Math.random() * 3
          dot.className = 'absolute block rounded-full bg-water'
          dot.style.width = `${size}px`
          dot.style.height = `${size}px`
          dot.style.left = `${x}px`
          dot.style.top = `${y}px`
          layer.appendChild(dot)
          active += 1
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15
          const distance = 26 + Math.random() * 46
          gsap.fromTo(
            dot,
            { x: 0, y: 0, scale: 1, opacity: 0.9 },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance + 26,
              scale: 0.35,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
              onComplete: () => {
                dot.remove()
                active -= 1
              },
            },
          )
        }
      }
      card.addEventListener('pointerdown', onPointerDown)

      return () => {
        card.removeEventListener('pointerdown', onPointerDown)
        trigger.kill()
        layer.replaceChildren()
      }
    },
    [reduced, isMobile],
    sectionRef,
  )

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      aria-labelledby="kontakt-title"
      className="relative scroll-mt-[var(--nav-height)] pt-16 pb-24 md:pt-36 md:pb-32"
    >
      <div className="container-x">
        <div className="relative mx-auto w-full max-w-[40rem]">
          <div
            ref={faucetRef}
            className="relative mx-auto aspect-[320/220] w-[min(320px,82%)] md:mx-0 md:ml-8"
          >
            <Faucet standalone={isMobile} className="h-full w-full" />
            <span
              id="faucet-inlet"
              aria-hidden="true"
              className="absolute size-px"
              style={{
                left: `${(FAUCET_INLET.x / FAUCET_VIEW.width) * 100}%`,
                top: `${(FAUCET_INLET.y / FAUCET_VIEW.height) * 100}%`,
              }}
            />
          </div>

          <div ref={cardWrapRef} className="relative mt-8">
            <div aria-hidden="true" className="glow-water" />
            <div ref={cardRef} className="glass relative rounded-lg p-6 md:p-10">
              <h2 id="kontakt-title" data-card-item="" className="display-lg text-text">
                {site.contact.title}
              </h2>
              <p data-card-item="" className="mt-5 max-w-lg text-base leading-relaxed text-muted">
                {site.contact.lead}
              </p>

              <div data-card-item="" className="mt-8">
                <p className="label-mono mb-2">{site.contact.emailLabel}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    ref={emailRef}
                    href={`mailto:${site.email}`}
                    className="display-md break-anywhere min-h-11 text-[1.15rem] text-water hover:text-text sm:text-[1.5rem] md:text-[2rem]"
                  >
                    {site.email}
                  </a>
                  <Button variant="outline" type="button" onClick={copyEmail}>
                    {site.contact.copyLabel}
                  </Button>
                </div>
                <p aria-live="polite" className="label-mono mt-3 min-h-5 text-water">
                  {message}
                </p>
              </div>

              {phone ? (
                <div data-card-item="" className="mt-6">
                  <Button asChild size="lg">
                    <a href={`tel:${phone}`}>{site.contact.callLabel}</a>
                  </Button>
                </div>
              ) : null}

              <div data-card-item="" className="mt-8 border-t border-line pt-5">
                <p className="label-mono">{site.contact.hoursLabel}</p>
                <p className="mt-1 font-mono text-sm text-text">{site.hours}</p>
              </div>
            </div>
            <div
              ref={burstRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
