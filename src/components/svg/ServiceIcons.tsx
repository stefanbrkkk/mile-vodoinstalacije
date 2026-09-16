import type { ServiceIcon as ServiceIconKey } from '@/config/site'
import { TUBE } from './pipe-style'

const COMMON = {
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Rotates/translates around the shape's own box, not the SVG viewport — needed for hover micro-moves. */
const MOVE = '[transform-box:fill-box] [transform-origin:center] transition-transform duration-300'

type Props = { icon: ServiceIconKey; className?: string }

/**
 * Small technical line icons for the services grid, one per `ServiceIcon` key.
 * Copper strokes with a single water-colored accent; one part of each icon
 * carries a subtle hover micro-move (fine pointers only, via `group-hover:`,
 * which Tailwind already scopes to `(hover: hover)` so touch never triggers it).
 */
export function ServiceIcon({ icon, className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      {icon === 'emergency' ? (
        <>
          <g {...COMMON} stroke={TUBE.copper} className={`${MOVE} motion-safe:group-hover:-rotate-6`}>
            <path d="M10 30a14 14 0 0 1 28 0" />
            <path d="M7 30h34" />
          </g>
          <g stroke={TUBE.water} strokeWidth={1.6} strokeLinecap="round" fill="none">
            <path d="M24 6v5" />
            <path d="M14 10l2.4 3.4" />
            <path d="M34 10l-2.4 3.4" />
          </g>
          <g stroke={TUBE.water} strokeWidth={1.4} fill="none">
            <circle cx="35" cy="35" r="7.5" />
            <path d="M35 31.5V35l2.6 1.8" strokeLinecap="round" />
          </g>
        </>
      ) : null}

      {icon === 'drain' ? (
        <>
          <circle cx="24" cy="24" r="17" stroke={TUBE.copper} {...COMMON} />
          <g stroke={TUBE.copper} strokeWidth={1.3} opacity={0.8}>
            <path d="M11.5 18h25M9.5 24h29M11.5 30h25" />
          </g>
          <path
            d="M24 15.5c5 0 7.5 3 7.5 6.8S28 28 24 28s-6.5-2.2-6.5-5.4 3.2-4.9 6.5-4.9"
            stroke={TUBE.water}
            strokeWidth={1.8}
            fill="none"
            strokeLinecap="round"
            className={`${MOVE} duration-500 motion-safe:group-hover:rotate-90`}
          />
        </>
      ) : null}

      {icon === 'leak' ? (
        <>
          <g stroke={TUBE.copper} {...COMMON}>
            <path d="M5 16h13" />
            <rect x="19" y="12.4" width="10" height="7.2" rx="2" />
            <path d="M29 16h14" />
          </g>
          <path
            d="M24 24c-3.2 4.2-5.2 7-5.2 9.6a5.2 5.2 0 0 0 10.4 0c0-2.6-2-5.4-5.2-9.6Z"
            fill={TUBE.water}
            className={`${MOVE} motion-safe:group-hover:translate-y-1`}
          />
          <path
            d="M16.5 39.5c2.6 1.1 5.3 1.6 7.5 1.6s4.9-.5 7.5-1.6"
            stroke={TUBE.water}
            strokeWidth={1.3}
            opacity={0.5}
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : null}

      {icon === 'boiler' ? (
        <>
          <rect x="13" y="11" width="22" height="30" rx="7" stroke={TUBE.copper} {...COMMON} />
          <path d="M18 19h12M18 25h12M18 31h8" stroke={TUBE.copper} strokeWidth={1.2} opacity={0.5} />
          <g className={`${MOVE} motion-safe:group-hover:-translate-y-1`}>
            <rect x="19" y="4" width="10" height="6.5" rx="1.8" stroke={TUBE.copper} {...COMMON} />
            <circle cx="24" cy="7.2" r="1.2" fill={TUBE.water} />
          </g>
          <path d="M11 33a3 3 0 0 1-3-3v-3" stroke={TUBE.water} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </>
      ) : null}

      {icon === 'sanitary' ? (
        <>
          <path d="M7 24c0 7.3 7.6 13 17 13s17-5.7 17-13" stroke={TUBE.copper} {...COMMON} />
          <path d="M5 24h38" stroke={TUBE.copper} {...COMMON} />
          <path d="M18 24v-8a4 4 0 0 1 4-4h2" stroke={TUBE.copper} {...COMMON} />
          <path d="M24 12h6.5a3 3 0 0 1 3 3v2" stroke={TUBE.copper} {...COMMON} />
          <circle
            cx="33.5"
            cy="19.5"
            r="1.5"
            fill={TUBE.water}
            className={`${MOVE} motion-safe:group-hover:translate-y-1`}
          />
          <circle cx="24" cy="24.5" r="1.3" fill={TUBE.water} opacity={0.7} />
        </>
      ) : null}

      {icon === 'bathroom' ? (
        <>
          <path d="M6 29h36" stroke={TUBE.copper} {...COMMON} />
          <path d="M8 29v-3.5a4 4 0 0 1 4-4h20a6 6 0 0 1 6 6v1.5" stroke={TUBE.copper} {...COMMON} />
          <path d="M6 29c0 5 3.6 8.5 8.2 8.5h19.6c4.6 0 8.2-3.5 8.2-8.5" stroke={TUBE.copper} {...COMMON} />
          <path d="M13.5 17v-6.5a3 3 0 0 1 3-3h1" stroke={TUBE.copper} {...COMMON} />
          <circle cx="17.5" cy="7" r="3" stroke={TUBE.copper} {...COMMON} />
          <g
            stroke={TUBE.water}
            strokeWidth={1.4}
            strokeLinecap="round"
            fill="none"
            className={`${MOVE} motion-safe:group-hover:translate-y-1`}
          >
            <path d="M15 14v4M19 14v5M23 15v3" />
          </g>
        </>
      ) : null}
    </svg>
  )
}
