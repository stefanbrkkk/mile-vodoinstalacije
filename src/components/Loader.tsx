import { useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useReducedMotion } from '@/lib/motion'
import { introAlreadySeen, markIntroSeen } from '@/lib/intro'
import { Drop } from '@/components/svg/Drop'

/** Hard cap: onDone always fires by this time, even if the animation stalls (backgrounded tab). */
const SAFETY_MS = 1200

type Props = { onDone: () => void }

/**
 * Once-per-session intro: a drop falls, a ring expands from the impact point, the
 * overlay fades to reveal the page. Skipped entirely (render null, call onDone once)
 * when already seen this session or reduced motion is on.
 */
export function Loader({ onDone }: Props) {
  const reducedMotion = useReducedMotion()
  const [skip] = useState(() => introAlreadySeen() || reducedMotion)
  const [visible, setVisible] = useState(() => !skip)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const dropRef = useRef<SVGSVGElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useGsap(() => {
    if (skip) {
      onDone()
      return
    }

    const overlay = overlayRef.current
    const drop = dropRef.current
    const ring = ringRef.current
    if (!overlay || !drop || !ring) {
      onDone()
      return
    }

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      markIntroSeen()
      onDone()
      setVisible(false)
    }

    const safety = window.setTimeout(finish, SAFETY_MS)

    gsap.set(drop, { y: -140, opacity: 1 })
    gsap.set(ring, { scale: 0, opacity: 0 })

    // Timeline: drop falls (0–0.42s) -> impact pop + ring expansion (0.40–0.88s) ->
    // overlay reveals the page (0.5–0.9s). Transform + opacity only, ~0.9s total.
    const tl = gsap.timeline({ onComplete: finish })
    tl.to(drop, { y: 0, duration: 0.42, ease: 'power2.in' }, 0)
      .to(drop, { opacity: 0, duration: 0.14, ease: 'power1.out' }, 0.4)
      .to(ring, { opacity: 0.9, scale: 1, duration: 0.08, ease: 'power1.out' }, 0.4)
      .to(ring, { scale: 3.2, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.48)
      .to(overlay, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 0.5)

    return () => {
      window.clearTimeout(safety)
      tl.kill()
    }
  }, [skip])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-ink"
    >
      <div className="relative flex items-center justify-center">
        <div ref={ringRef} className="absolute h-16 w-16 rounded-full border-2 border-water" />
        <Drop ref={dropRef} className="relative h-8 w-8 text-water" />
      </div>
    </div>
  )
}
