import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'

type Props = {
  className?: string
  /** Slowly drifts the turbulence baseFrequency; disabled on mobile and reduced motion. */
  animate: boolean
}

/**
 * Soft cyan glow distorted by SVG turbulence to suggest water caustics. The turbulence
 * itself is a deliberate CLAUDE.md exception ("small local SVG turbulence"); only its
 * baseFrequency is tweened, never a page-wide filter.
 */
export function Caustics({ className, animate }: Props) {
  const turbRef = useRef<SVGFETurbulenceElement | null>(null)

  useGsap(() => {
    if (!animate) return
    const turb = turbRef.current
    if (!turb) return
    const state = { freq: 0.012 }
    const tween = gsap.to(state, {
      freq: 0.02,
      duration: 14,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      onUpdate: () => turb.setAttribute('baseFrequency', `${state.freq} ${state.freq * 1.6}`),
    })
    return () => {
      tween.kill()
    }
  }, [animate])

  return (
    <svg
      className={className}
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="mile-caustics-turbulence" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={40} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id="mile-caustics-glow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#3FC5F0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3FC5F0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="800" fill="url(#mile-caustics-glow)" filter="url(#mile-caustics-turbulence)" opacity="0.35" />
    </svg>
  )
}
