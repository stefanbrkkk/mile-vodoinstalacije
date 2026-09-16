import { Tube } from './PipeDefs'
import { FAUCET_SPOUT, FAUCET_VIEW, TUBE } from './pipe-style'

const SPLASH_DROPS = [0, 1, 2, 3, 4, 5]
const SPLASH_RINGS = [0, 1]

type Props = {
  className?: string
  /** Mobile: no page pipe, so the faucet caps its own supply stub. */
  standalone?: boolean
}

/** Copper tap with a lever handle, a drop and a splash. Decorative only. */
export function Faucet({ className, standalone = false }: Props) {
  return (
    <svg
      viewBox={`0 0 ${FAUCET_VIEW.width} ${FAUCET_VIEW.height}`}
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Counter the tap is mounted on */}
      <g stroke={TUBE.guide} fill="none">
        <path d="M0 190 H 320" strokeWidth="2" />
        <path d="M0 196 H 320" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Supply stub: continues the page pipe down to the tap base */}
      <Tube d="M40 4 V 168 Q 40 196 68 196 H 150 V 186" width={9} />
      {standalone ? (
        <g>
          <path d="M28 10 H 52" stroke={TUBE.shadow} strokeWidth="7" strokeLinecap="round" />
          <path d="M28 10 H 52" stroke={TUBE.copper} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M31 20 H 49" stroke={TUBE.copper} strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
        </g>
      ) : null}

      {/* Base plate */}
      <rect x="116" y="172" width="68" height="18" rx="5" fill={TUBE.cavity} stroke={TUBE.shadow} strokeWidth="4" />
      <rect x="116" y="172" width="68" height="18" rx="5" fill="none" stroke={TUBE.copper} strokeWidth="2.4" />

      {/* Body and gooseneck */}
      <Tube d="M150 176 V 88" width={17} />
      <Tube d="M150 92 Q 150 54 186 54 H 220 Q 248 54 248 84 V 104" width={15} />
      <rect x="239" y="100" width="18" height="10" rx="3" fill={TUBE.cavity} stroke={TUBE.copper} strokeWidth="2" />

      {/* Lever handle: pivots at FAUCET_PIVOT */}
      <g data-faucet-handle="">
        <path d="M148 96 L 106 108" stroke={TUBE.shadow} strokeWidth="12" strokeLinecap="round" />
        <path d="M148 96 L 106 108" stroke={TUBE.copper} strokeWidth="7.5" strokeLinecap="round" />
        <circle cx="102" cy="109" r="9" fill={TUBE.cavity} stroke={TUBE.copper} strokeWidth="2.6" />
        <circle cx="150" cy="94" r="7" fill={TUBE.cavity} stroke={TUBE.copper} strokeWidth="2.4" />
      </g>

      {/* Drop + splash live in user units; the Contact timeline places them. */}
      <g data-drop="" opacity="0">
        <ellipse cx={FAUCET_SPOUT.x} cy={FAUCET_SPOUT.y} rx="4.2" ry="5.6" fill={TUBE.water} />
        <ellipse cx={FAUCET_SPOUT.x - 1.2} cy={FAUCET_SPOUT.y - 1.6} rx="1.4" ry="1.8" fill="#DFF6FF" />
      </g>

      <g data-splash="" opacity="0">
        {SPLASH_RINGS.map((i) => (
          <ellipse
            key={`ring-${i}`}
            data-splash-ring=""
            cx="0"
            cy="0"
            rx="9"
            ry="3.4"
            fill="none"
            stroke={TUBE.water}
            strokeWidth="1.6"
          />
        ))}
        {SPLASH_DROPS.map((i) => (
          <circle key={`drop-${i}`} data-splash-drop="" cx="0" cy="0" r="2.6" fill={TUBE.water} />
        ))}
      </g>
    </svg>
  )
}
