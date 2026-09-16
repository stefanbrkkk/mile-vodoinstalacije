import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { cn } from '@/lib/utils'
import {
  SHORT_VIEWPORT_QUERY,
  useFinePointer,
  useIsMobile,
  useMediaQuery,
  useOnScreen,
  useReducedMotion,
} from '@/lib/motion'
import { site } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Caustics } from '@/components/svg/Caustics'
import { HeroElbow } from '@/components/svg/HeroElbow'
import { Drop } from '@/components/svg/Drop'

type Props = { introDone: boolean; /** False when the bundle arrived late: words are simply shown, no drop-in. */ entrance?: boolean }

const PARALLAX_RANGE = 28 // total px range -> roughly ±14px

function ScrollHint({ reducedMotion }: { reducedMotion: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const dropRef = useRef<SVGSVGElement | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const onScreen = useOnScreen(wrapRef)

  useGsap(() => {
    if (reducedMotion) return
    const el = dropRef.current
    if (!el) return
    const tween = gsap.to(el, { y: 8, duration: 1.1, ease: 'sine.inOut', repeat: -1, yoyo: true })
    tweenRef.current = tween
    return () => {
      tween.kill()
      tweenRef.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    tweenRef.current?.paused(!onScreen)
  }, [onScreen])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2">
      <span className="label-mono">{site.hero.scrollHint}</span>
      <Drop ref={dropRef} className="h-4 w-4 text-water" />
    </div>
  )
}

export function Hero({ introDone, entrance = true }: Props) {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const finePointer = useFinePointer()
  const shortViewport = useMediaQuery(SHORT_VIEWPORT_QUERY)

  const sectionRef = useRef<HTMLElement | null>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const punchlineRef = useRef<HTMLParagraphElement | null>(null)
  const elbowRef = useRef<SVGSVGElement | null>(null)

  // Word-drop reveal, played whenever `introDone` becomes true (immediately if the
  // intro loader was skipped). Reduced motion: no gsap.set ever runs, so the natural
  // (untransformed) DOM is the final, fully visible state from first paint.
  useGsap(() => {
    if (reducedMotion || !entrance) return
    const words = wordRefs.current.filter((el): el is HTMLSpanElement => !!el)
    const punchline = punchlineRef.current
    if (!words.length) return

    gsap.set(words, { yPercent: 110 })
    if (punchline) gsap.set(punchline, { autoAlpha: 0, y: 16 })
    if (!introDone) return

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(words, { yPercent: 0, duration: 0.9, stagger: 0.12 })
    if (punchline) tl.to(punchline, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.45')

    return () => {
      tl.kill()
    }
  }, [introDone, reducedMotion, entrance])

  // Light mouse parallax on the copper elbow (fine pointers, motion allowed, only over the section).
  useGsap(() => {
    if (reducedMotion || !finePointer) return
    const section = sectionRef.current
    const elbow = elbowRef.current
    if (!section || !elbow) return

    const moveX = gsap.quickTo(elbow, 'x', { duration: 0.6, ease: 'power3.out' })
    const moveY = gsap.quickTo(elbow, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width - 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5
      moveX(relX * PARALLAX_RANGE)
      moveY(relY * PARALLAX_RANGE)
    }

    section.addEventListener('pointermove', onMove)
    return () => section.removeEventListener('pointermove', onMove)
  }, [reducedMotion, finePointer])

  return (
    <section
      id="vrh"
      ref={sectionRef}
      className="relative isolate flex min-h-svh scroll-mt-[var(--nav-height)] items-stretch overflow-hidden pt-[var(--nav-height)]"
    >
      <Caustics animate={!reducedMotion && !isMobile} className="absolute inset-0 z-0 h-full w-full" />

      {/* Always absolute/out-of-flow: the section is a flex row, so anything else here
          would become a flex item and shove the text column sideways. */}
      <HeroElbow
        ref={elbowRef}
        className={cn(
          'pointer-events-none absolute right-[-30px] top-14 z-0 h-40 w-40 opacity-[0.55]',
          // Tablet: bigger, tucked into the bottom-right corner, clear of the text band.
          'md:top-auto md:bottom-[-30px] md:right-[-40px] md:h-[300px] md:w-[300px] md:opacity-40',
          // Desktop: the full dramatic elbow, vertically centred and partly cropped by the edge.
          'lg:bottom-auto lg:top-1/2 lg:right-[-60px] lg:h-[520px] lg:w-[520px] lg:-translate-y-1/2 lg:opacity-100',
        )}
      />

      <div className="container-x relative z-10 flex w-full flex-col justify-center gap-8 py-16">
        <div>
          <h1 className="display-xl text-text">
            {site.hero.words.map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <span
                  ref={(el) => {
                    wordRefs.current[i] = el
                  }}
                  className="block will-change-transform"
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <p
            ref={punchlineRef}
            className="serif-accent mt-2 text-[clamp(2.1rem,8.05vw,6.3rem)] leading-[0.95] text-water"
          >
            {site.hero.punchline}
          </p>
        </div>

        <p className="max-w-[34ch] text-[1.05rem] leading-relaxed text-muted md:text-[1.15rem]">
          {site.hero.subtitle}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={site.cta.primary.href}>{site.cta.primary.label}</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href={site.cta.secondary.href}>{site.cta.secondary.label}</a>
          </Button>
          {site.phone ? (
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href={`tel:${site.phone}`}>{site.phone}</a>
            </Button>
          ) : null}
        </div>
      </div>

      {shortViewport ? null : <ScrollHint reducedMotion={reducedMotion} />}
    </section>
  )
}
