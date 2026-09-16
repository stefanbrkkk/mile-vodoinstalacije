import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useIsMobile, useReducedMotion } from '@/lib/motion'
import { TUBE, ringsPath, roundedPolyline, type Point } from '@/components/svg/pipe-style'

/** Sections the pipe visibly bends toward on its way down the page. */
const JOG_SECTIONS = ['poverenje', 'anatomija', 'usluge', 'kako-radim', 'pre-posle', 'utisci', 'pitanja'] as const

const JOG_WIDTH = 16
const JOG_HEIGHT = 56
const ELBOW = 14
const TUBE_WIDTH = 9
const FALLBACK_PIPE_X = 44

type Geometry = { d: string; rings: string; width: number; height: number; pipeX: number }

/**
 * Builds the whole run in document coordinates: down the left strip, a short jog
 * at the top of every marked section, then a right turn into the faucet inlet.
 * Called only on refresh (ScrollTrigger refreshInit, resize), never per frame.
 */
function buildGeometry(): Geometry | null {
  const docEl = document.documentElement
  const width = docEl.clientWidth
  const height = Math.max(docEl.scrollHeight, document.body.scrollHeight) - 1
  if (width < 2 || height < 200) return null

  const pipeX = Number.parseFloat(getComputedStyle(docEl).getPropertyValue('--pipe-x')) || FALLBACK_PIPE_X
  const scrollY = window.scrollY
  const scrollX = window.scrollX
  const points: Point[] = [{ x: pipeX, y: 0 }]
  const joints: Point[] = []
  let lastY = 0

  for (const id of JOG_SECTIONS) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = Math.round(el.getBoundingClientRect().top + scrollY) + 16
    const bottom = top + JOG_HEIGHT
    if (top < lastY + 3 * ELBOW || bottom > height - 220) continue
    points.push(
      { x: pipeX, y: top },
      { x: pipeX + JOG_WIDTH, y: top },
      { x: pipeX + JOG_WIDTH, y: bottom },
      { x: pipeX, y: bottom },
    )
    joints.push({ x: pipeX + JOG_WIDTH, y: top }, { x: pipeX + JOG_WIDTH, y: bottom })
    lastY = bottom
  }

  const inlet = document.getElementById('faucet-inlet')
  const rect = inlet?.getBoundingClientRect()
  if (rect && rect.width > 0) {
    const inletX = rect.left + rect.width / 2 + scrollX
    const inletY = rect.top + rect.height / 2 + scrollY
    const turnY = Math.max(lastY + 3 * ELBOW, inletY - 96)
    if (inletX > pipeX + 4 * ELBOW && turnY < inletY - 2 * ELBOW) {
      points.push({ x: pipeX, y: turnY }, { x: inletX, y: turnY }, { x: inletX, y: inletY })
      joints.push({ x: pipeX, y: turnY }, { x: inletX, y: turnY })
    } else {
      points.push({ x: pipeX, y: Math.min(inletY, height - 40) })
    }
  } else {
    points.push({ x: pipeX, y: Math.max(lastY + 40, height - 160) })
  }

  return { d: roundedPolyline(points, ELBOW), rings: ringsPath(joints, 7.5), width, height, pipeX }
}

/**
 * The copper pipe that ties the whole page together. Desktop: one document-tall
 * SVG in the left strip whose cyan core fills as the page scrolls. Below 768px:
 * a 3px progress bar at the very top. Reduced motion: the pipe is drawn full of
 * water, with no ScrollTrigger at all.
 */
export function Pipe() {
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const tubeRef = useRef<SVGGElement>(null)
  const ringsRef = useRef<SVGGElement>(null)
  const waterRef = useRef<SVGPathElement>(null)
  const waterGlowRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const gradientRef = useRef<SVGLinearGradientElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useGsap(() => {
    if (isMobile) {
      const bar = barRef.current
      if (!bar || reduced) return
      gsap.set(bar, { scaleX: 0 })
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      })
      return
    }

    const svg = svgRef.current
    const water = waterRef.current
    const waterGlow = waterGlowRef.current
    const head = headRef.current
    if (!svg || !water || !waterGlow || !head || !tubeRef.current || !ringsRef.current) return

    const tubePaths = Array.from(tubeRef.current.querySelectorAll('path'))
    const ringPaths = Array.from(ringsRef.current.querySelectorAll('path'))
    const waterPaths = [waterGlow, water]
    let length = 0
    let tween: gsap.core.Tween | null = null

    const applyGeometry = () => {
      const geo = buildGeometry()
      if (!geo) return
      svg.setAttribute('viewBox', `0 0 ${geo.width} ${geo.height}`)
      svg.style.width = `${geo.width}px`
      svg.style.height = `${geo.height}px`
      for (const path of tubePaths) path.setAttribute('d', geo.d)
      for (const path of ringPaths) path.setAttribute('d', geo.rings)
      for (const path of waterPaths) path.setAttribute('d', geo.d)
      gradientRef.current?.setAttribute('x1', String(geo.pipeX - TUBE_WIDTH / 2))
      gradientRef.current?.setAttribute('x2', String(geo.pipeX + TUBE_WIDTH / 2))
      length = water.getTotalLength()
      gsap.set(waterPaths, { strokeDasharray: length, strokeDashoffset: reduced ? 0 : length })
      tween?.invalidate()
      updateHead()
    }

    function updateHead() {
      if (!water || !head || !length) return
      const progress = tween ? tween.progress() : 1
      const point = water.getPointAtLength(length * progress)
      gsap.set(head, { x: point.x, y: point.y, opacity: progress > 0.004 ? 1 : 0 })
    }

    applyGeometry()

    if (!reduced) {
      tween = gsap.to(waterPaths, {
        strokeDashoffset: 0,
        ease: 'none',
        onUpdate: updateHead,
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      updateHead()
    }

    ScrollTrigger.addEventListener('refreshInit', applyGeometry)

    let timer = 0
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(applyGeometry, 100)
    })
    observer.observe(document.body)
    document.fonts?.ready.then(applyGeometry).catch(() => {})

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', applyGeometry)
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [isMobile, reduced])

  if (isMobile) {
    if (reduced) return null
    return (
      <div aria-hidden="true" data-progress-bar="" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] bg-line/40">
        <div ref={barRef} className="h-full origin-left bg-water" style={{ transform: 'scaleX(0)' }} />
      </div>
    )
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute top-0 left-0 z-20"
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          ref={gradientRef}
          id="pipe-copper"
          gradientUnits="userSpaceOnUse"
          x1={FALLBACK_PIPE_X - TUBE_WIDTH / 2}
          y1="0"
          x2={FALLBACK_PIPE_X + TUBE_WIDTH / 2}
          y2="0"
        >
          <stop offset="0" stopColor="#6E3A15" />
          <stop offset="0.3" stopColor={TUBE.copper} />
          <stop offset="0.52" stopColor="#F4B075" />
          <stop offset="0.78" stopColor="#B5682B" />
          <stop offset="1" stopColor={TUBE.copper} />
        </linearGradient>
        <radialGradient id="pipe-head">
          <stop offset="0" stopColor="#DFF6FF" />
          <stop offset="0.45" stopColor={TUBE.water} />
          <stop offset="1" stopColor={TUBE.water} stopOpacity="0" />
        </radialGradient>
        <filter id="pipe-bloom" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <g ref={tubeRef} data-pipe="tube">
        <path data-pipe-main="" fill="none" stroke={TUBE.shadow} strokeWidth={TUBE_WIDTH + 3.5} strokeLinecap="round" strokeLinejoin="round" />
        <path fill="none" stroke="url(#pipe-copper)" strokeWidth={TUBE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path
          fill="none"
          stroke={TUBE.highlight}
          strokeOpacity="0.45"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-2.2 -2.2)"
        />
      </g>

      <g ref={ringsRef}>
        <path fill="none" stroke={TUBE.shadow} strokeWidth="5" />
        <path fill="none" stroke={TUBE.copper} strokeWidth="2.4" />
      </g>

      <path
        ref={waterGlowRef}
        fill="none"
        stroke={TUBE.water}
        strokeOpacity="0.22"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        ref={waterRef}
        data-pipe-water=""
        fill="none"
        stroke={TUBE.water}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g ref={headRef} opacity="0">
        <circle r="9" fill="url(#pipe-head)" filter="url(#pipe-bloom)" />
        <circle r="2.6" fill="#EAF9FF" />
      </g>
    </svg>,
    document.body,
  )
}
