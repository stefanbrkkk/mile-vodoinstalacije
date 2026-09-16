import { forwardRef, type SVGProps } from 'react'
import { TUBE } from '@/components/svg/pipe-style'

// Centerline of the bend: a vertical run from the top flange, a rounded 90° corner,
// then a horizontal run toward the left edge (open end, implying the pipe continues
// off-canvas). Same construction the page Pipe uses: straight segments meeting a
// quadratic corner whose control point is the geometric corner itself.
const TOP = { x: 290, y: 45 }
const CORNER = { x: 290, y: 290 }
const LEFT = { x: 55, y: 290 }
const BEND_R = 115
const CENTERLINE = `M ${TOP.x} ${TOP.y} L ${TOP.x} ${CORNER.y - BEND_R} Q ${CORNER.x} ${CORNER.y} ${CORNER.x - BEND_R} ${CORNER.y} L ${LEFT.x} ${LEFT.y}`
const HORIZONTAL_RUN = `M ${CORNER.x - BEND_R} ${CORNER.y} L ${LEFT.x} ${LEFT.y}`
const INNER_R = 55
const INNER_SHADOW = `M ${TOP.x} ${CORNER.y - INNER_R} Q ${CORNER.x} ${CORNER.y} ${CORNER.x - INNER_R} ${CORNER.y}`

const TUBE_D = 92
const COPPER_STOPS = (
  <>
    <stop offset="0%" stopColor="#6E3A15" />
    <stop offset="30%" stopColor={TUBE.copper} />
    <stop offset="52%" stopColor="#F4B075" />
    <stop offset="78%" stopColor="#B5682B" />
    <stop offset="100%" stopColor={TUBE.copper} />
  </>
)

/**
 * Large 90-degree copper elbow, built with the same palette/technique as the page
 * Pipe: a thick stroked centerline, a gradient running perpendicular to the tube
 * axis for cylindrical shading, a bright offset highlight, a darker inner-bend
 * shadow, flange collars with bolts at both open ends, and a few water beads.
 * Purely decorative background illustration for the hero.
 */
export const HeroElbow = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function HeroElbow(
  { className, ...props },
  ref,
) {
  return (
    <svg ref={ref} viewBox="0 0 420 420" className={className} {...props} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mile-elbow-copper-v" gradientUnits="userSpaceOnUse" x1={TOP.x - TUBE_D / 2} y1="0" x2={TOP.x + TUBE_D / 2} y2="0">
          {COPPER_STOPS}
        </linearGradient>
        <linearGradient id="mile-elbow-copper-h" gradientUnits="userSpaceOnUse" x1="0" y1={LEFT.y - TUBE_D / 2} x2="0" y2={LEFT.y + TUBE_D / 2}>
          {COPPER_STOPS}
        </linearGradient>
      </defs>

      {/* dark outer edge, continuous around the whole bend */}
      <path d={CENTERLINE} fill="none" stroke={TUBE.shadow} strokeWidth={TUBE_D + 10} strokeLinecap="round" strokeLinejoin="round" />

      {/* main copper body: vertical-axis shading as the base (covers the curve too) */}
      <path d={CENTERLINE} fill="none" stroke="url(#mile-elbow-copper-v)" strokeWidth={TUBE_D} strokeLinecap="round" strokeLinejoin="round" />
      {/* horizontal arm gets its own perpendicular shading on top, so both arms read correctly */}
      <path d={HORIZONTAL_RUN} fill="none" stroke="url(#mile-elbow-copper-h)" strokeWidth={TUBE_D} strokeLinecap="round" />

      {/* darker shadow hugging the inside of the bend */}
      <path d={INNER_SHADOW} fill="none" stroke={TUBE.shadow} strokeOpacity="0.35" strokeWidth={38} strokeLinecap="round" />

      {/* bright highlight, offset to one side on each straight run */}
      <path
        d={`M ${TOP.x - 15} ${TOP.y} L ${TOP.x - 15} ${CORNER.y - BEND_R}`}
        fill="none"
        stroke={TUBE.highlight}
        strokeOpacity="0.55"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${CORNER.x - BEND_R} ${LEFT.y - 15} L ${LEFT.x} ${LEFT.y - 15}`}
        fill="none"
        stroke={TUBE.highlight}
        strokeOpacity="0.5"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* flange + bolts at the top open end */}
      <line x1={TOP.x - TUBE_D / 2} y1={TOP.y + 27} x2={TOP.x + TUBE_D / 2} y2={TOP.y + 27} stroke="#B5682B" strokeWidth="20" strokeLinecap="round" />
      <ellipse cx={TOP.x} cy={TOP.y} rx={TUBE_D / 2 + 2} ry="13" fill="#5C3213" stroke="#3A1F0C" strokeWidth="2" />
      <circle cx={TOP.x - 40} cy={TOP.y + 27} r="5" fill="#2E1707" />
      <circle cx={TOP.x + 40} cy={TOP.y + 27} r="5" fill="#2E1707" />

      {/* flange + bolts at the left open end */}
      <line x1={LEFT.x + 27} y1={LEFT.y - TUBE_D / 2} x2={LEFT.x + 27} y2={LEFT.y + TUBE_D / 2} stroke="#B5682B" strokeWidth="20" strokeLinecap="round" />
      <ellipse cx={LEFT.x} cy={LEFT.y} rx="13" ry={TUBE_D / 2 + 2} fill="#5C3213" stroke="#3A1F0C" strokeWidth="2" />
      <circle cx={LEFT.x + 27} cy={LEFT.y - 40} r="5" fill="#2E1707" />
      <circle cx={LEFT.x + 27} cy={LEFT.y + 40} r="5" fill="#2E1707" />

      {/* water beads dripping off the horizontal run */}
      <circle cx="150" cy="352" r="6" fill={TUBE.water} opacity="0.85" />
      <circle cx="115" cy="366" r="3.5" fill={TUBE.water} opacity="0.6" />
      <circle cx="185" cy="368" r="3" fill={TUBE.water} opacity="0.5" />
    </svg>
  )
})
