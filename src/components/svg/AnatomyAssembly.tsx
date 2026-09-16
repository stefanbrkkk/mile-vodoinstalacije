import type { ReactNode } from 'react'
import type { AnatomyPartId } from '@/config/site'
import { Tube } from './PipeDefs'
import { TUBE } from './pipe-style'

type PartProps = {
  id: AnatomyPartId
  /** Soft cyan light that fades in while the part is the active one. */
  glow: { cx: number; cy: number; r: number }
  /** Simplified silhouette used for the water-cyan rim light. */
  halo: string[]
  haloWidth?: number
  children: ReactNode
}

function Part({ id, glow, halo, haloWidth = 14, children }: PartProps) {
  return (
    <g data-part={id}>
      <circle data-glow="" cx={glow.cx} cy={glow.cy} r={glow.r} fill="url(#an-glow)" opacity="0" />
      <g data-halo="" opacity="0">
        {halo.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={TUBE.water}
            strokeOpacity="0.3"
            strokeWidth={haloWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
      {children}
      <g data-halo="" opacity="0">
        {halo.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="#BFEEFF"
            strokeOpacity="0.85"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
    </g>
  )
}

const TRAP_BODY = 'M310 306 H390 V382 Q390 408 364 408 H336 Q310 408 310 382 Z'
const UNION_NUT = 'M124 296 L134 288 H166 L176 296 V314 L166 322 H134 L124 314 Z'
const GASKET_RING = 'M171 333 A 21 8 0 1 0 129 333 A 21 8 0 1 0 171 333'

/**
 * Cross-section of a typical under-sink assembly: supply riser with an angle
 * valve, union nut and gasket on the left, sink drain into a bottle trap on the
 * right. Each of the five serviceable parts is its own `[data-part]` group that
 * the Anatomy timeline slides out of place. Decorative only.
 */
export function AnatomyAssembly({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 560"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="an-glow">
          <stop offset="0" stopColor={TUBE.water} stopOpacity="0.5" />
          <stop offset="0.55" stopColor={TUBE.water} stopOpacity="0.16" />
          <stop offset="1" stopColor={TUBE.water} stopOpacity="0" />
        </radialGradient>
        <pattern id="an-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={TUBE.guide} strokeWidth="1.4" />
        </pattern>
      </defs>

      {/* Technical guide lines: centrelines, dimension ticks, sheet corners. */}
      <g stroke={TUBE.guide} fill="none" strokeWidth="1">
        <path d="M150 24 V 540" strokeDasharray="4 9" opacity="0.8" />
        <path d="M350 24 V 540" strokeDasharray="4 9" opacity="0.8" />
        <path d="M8 24 H 40 M8 24 V 56" opacity="0.7" />
        <path d="M512 24 H 480 M512 24 V 56" opacity="0.7" />
        <path d="M8 536 H 40 M8 536 V 504" opacity="0.7" />
        <path d="M512 536 H 480 M512 536 V 504" opacity="0.7" />
        <path d="M62 214 H 118 M62 209 V 219 M118 209 V 219" opacity="0.65" />
        <path d="M62 288 H 112 M62 283 V 293 M112 283 V 293" opacity="0.65" />
        <path d="M212 333 H 262 M212 328 V 338 M262 328 V 338" opacity="0.65" />
        <path d="M430 452 H 486 M430 447 V 457 M486 447 V 457" opacity="0.65" />
      </g>

      {/* Walls */}
      <g>
        <rect x="8" y="330" width="34" height="120" fill="url(#an-hatch)" opacity="0.5" />
        <path d="M42 330 V 450" stroke={TUBE.guide} strokeWidth="1.6" fill="none" />
        <rect x="466" y="288" width="46" height="130" fill="url(#an-hatch)" opacity="0.5" />
        <path d="M466 288 V 418" stroke={TUBE.guide} strokeWidth="1.6" fill="none" />
      </g>

      {/* Counter top and sink bowl in section */}
      <g stroke={TUBE.guide} fill="none" strokeWidth="2">
        <path d="M10 44 H 236" />
        <path d="M236 44 V 76 Q 236 116 276 116 H 424 Q 464 116 464 76 V 44" />
        <path d="M464 44 H 510" />
        <path d="M10 50 H 236 M464 50 H 510" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Static runs the serviceable parts sit between */}
      <Tube d="M350 116 V 306" width={13} />
      <Tube d="M150 274 V 294" width={11} />
      <Tube d="M150 326 V 372 Q 150 392 130 392 H 44" width={11} />

      <Part id="pipe" glow={{ cx: 150, cy: 134, r: 100 }} halo={['M150 56 V 214']} haloWidth={20}>
        <Tube d="M150 56 V 214" width={11} />
        <path d="M137 72 H163" stroke={TUBE.copper} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M137 81 H163" stroke={TUBE.copper} strokeWidth="3.4" strokeLinecap="round" opacity="0.65" />
      </Part>

      <Part
        id="valve"
        glow={{ cx: 136, cy: 248, r: 96 }}
        halo={['M126 218 H174 V278 H126 Z', 'M126 248 H100']}
        haloWidth={14}
      >
        <path d="M128 248 H108" stroke={TUBE.shadow} strokeWidth="12" strokeLinecap="round" />
        <path d="M128 248 H108" stroke={TUBE.copper} strokeWidth="7.5" strokeLinecap="round" />
        <rect x="126" y="218" width="48" height="60" rx="8" fill={TUBE.cavity} stroke={TUBE.shadow} strokeWidth="5" />
        <rect x="126" y="218" width="48" height="60" rx="8" fill="none" stroke={TUBE.copper} strokeWidth="2.6" />
        <path d="M126 233 H174 M126 263 H174" stroke={TUBE.copper} strokeWidth="1.5" opacity="0.5" />
        <path d="M133 224 V 272" stroke={TUBE.highlight} strokeWidth="2" opacity="0.35" />
        <ellipse cx="97" cy="248" rx="11" ry="18" fill={TUBE.cavity} stroke={TUBE.shadow} strokeWidth="4" />
        <ellipse cx="97" cy="248" rx="11" ry="18" fill="none" stroke={TUBE.copper} strokeWidth="2.6" />
        <path d="M97 236 V 260" stroke={TUBE.highlight} strokeWidth="1.4" opacity="0.5" />
      </Part>

      <Part id="union" glow={{ cx: 150, cy: 305, r: 78 }} halo={[UNION_NUT]} haloWidth={13}>
        <path d={UNION_NUT} fill={TUBE.cavity} stroke={TUBE.shadow} strokeWidth="5" strokeLinejoin="round" />
        <path d={UNION_NUT} fill="none" stroke={TUBE.copper} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M140 290 V 320 M160 290 V 320" stroke={TUBE.copper} strokeWidth="1.5" opacity="0.5" />
      </Part>

      <Part id="gasket" glow={{ cx: 150, cy: 333, r: 62 }} halo={[GASKET_RING]} haloWidth={11}>
        <ellipse cx="150" cy="333" rx="21" ry="8" fill="none" stroke={TUBE.shadow} strokeWidth="6.5" />
        <ellipse cx="150" cy="333" rx="21" ry="8" fill="none" stroke={TUBE.copper} strokeWidth="3" />
        <ellipse cx="150" cy="333" rx="12" ry="4.4" fill="none" stroke={TUBE.copper} strokeWidth="1.5" opacity="0.6" />
      </Part>

      <Part id="trap" glow={{ cx: 372, cy: 356, r: 124 }} halo={[TRAP_BODY, 'M390 336 H458']} haloWidth={16}>
        <Tube d="M390 336 H458" width={11} />
        <path d={TRAP_BODY} fill={TUBE.cavity} stroke={TUBE.shadow} strokeWidth="6" strokeLinejoin="round" />
        <path d={TRAP_BODY} fill="none" stroke={TUBE.copper} strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M316 360 H384" stroke={TUBE.water} strokeWidth="2" opacity="0.32" />
        <path d="M318 390 H382" stroke={TUBE.copper} strokeWidth="1.6" opacity="0.45" />
        <path d="M304 306 H396" stroke={TUBE.shadow} strokeWidth="9" strokeLinecap="round" />
        <path d="M304 306 H396" stroke={TUBE.copper} strokeWidth="5" strokeLinecap="round" />
        <path d="M320 314 V 372" stroke={TUBE.highlight} strokeWidth="2.4" opacity="0.28" />
      </Part>
    </svg>
  )
}
