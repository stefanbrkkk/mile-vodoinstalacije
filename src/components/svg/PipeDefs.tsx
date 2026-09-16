import { TUBE } from './pipe-style'

type DefsProps = {
  /** Unique prefix so several SVGs on the page never share gradient ids. */
  id: string
  /** User-space band the copper cross-section gradient is mapped onto. */
  x1?: number
  x2?: number
}

/**
 * Cross-section shading for a round copper tube: a dark left edge, the copper
 * body, a bright specular band and a darker right edge. Mapped in user space so
 * the same gradient shades every vertical run of one drawing identically.
 */
export function PipeDefs({ id, x1 = 0, x2 = 12 }: DefsProps) {
  return (
    <defs>
      <linearGradient id={`${id}-copper`} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
        <stop offset="0" stopColor="#6E3A15" />
        <stop offset="0.3" stopColor={TUBE.copper} />
        <stop offset="0.52" stopColor="#F4B075" />
        <stop offset="0.78" stopColor="#B5682B" />
        <stop offset="1" stopColor={TUBE.copper} />
      </linearGradient>
      <radialGradient id={`${id}-head`}>
        <stop offset="0" stopColor="#DFF6FF" />
        <stop offset="0.45" stopColor={TUBE.water} />
        <stop offset="1" stopColor={TUBE.water} stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-bloom`} x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
    </defs>
  )
}

type TubeProps = {
  d: string
  /** Outer diameter of the copper body in user units. */
  width?: number
  stroke?: string
  opacity?: number
  /** Set false for tubes seen head-on where a shifted highlight would read wrong. */
  highlight?: boolean
}

/** A round copper tube drawn as three stacked strokes along one path. */
export function Tube({ d, width = 11, stroke = TUBE.copper, opacity = 1, highlight = true }: TubeProps) {
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={TUBE.shadow}
        strokeWidth={width + 3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      {highlight ? (
        <path
          d={d}
          fill="none"
          stroke={TUBE.highlight}
          strokeOpacity="0.5"
          strokeWidth={Math.max(1, width * 0.16)}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${-width * 0.22} ${-width * 0.22})`}
        />
      ) : null}
    </g>
  )
}
