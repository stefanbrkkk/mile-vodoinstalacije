import { TUBE } from './pipe-style'
import { Tube } from './PipeDefs'

type Variant = 'before' | 'after'

/** Shared geometry so the two variants line up exactly (same wall, same pipe run, same joint/valve). */
const VIEW = { width: 800, height: 500 } as const
const PIPE_Y = 232
const PIPE_D = `M0 ${PIPE_Y} H 800`
const JOINT_CX = 300
const VALVE_X0 = 460
const VALVE_X1 = 566
const VALVE_HANDLE_X = 512
const FLOOR_Y = 428
const PUDDLE_CY = 452

const RUST = {
  shadow: '#241d13',
  iron: '#6b6354',
  rust: '#8a4a24',
  verdigris: '#57624a',
  stain: '#04100a',
} as const

/** Weathered copper: a dull iron body with broken rust/verdigris hatching instead of a smooth gradient. */
function RustyPipe({ d }: { d: string }) {
  return (
    <g>
      <path d={d} stroke={RUST.shadow} strokeWidth={19} strokeLinecap="round" fill="none" />
      <path d={d} stroke={RUST.iron} strokeWidth={15} strokeLinecap="round" fill="none" />
      <path
        d={d}
        stroke={RUST.rust}
        strokeWidth={15}
        strokeLinecap="round"
        fill="none"
        strokeDasharray="6 10"
        opacity={0.55}
      />
      <path
        d={d}
        stroke={RUST.verdigris}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        strokeDasharray="3 27"
        opacity={0.5}
        transform="translate(0 4)"
      />
    </g>
  )
}

/** Same run, drawn clean: the shared copper Tube plus a faint water-lit core. */
function CleanPipe({ d }: { d: string }) {
  return (
    <g>
      <Tube d={d} width={15} />
      <path d={d} stroke={TUBE.water} strokeWidth={4} strokeOpacity={0.32} strokeLinecap="round" fill="none" />
    </g>
  )
}

/** Technical guide lines shared by both variants, reinforcing the "same composition" read. */
function GuideLines() {
  return (
    <g stroke={TUBE.guide} strokeWidth={1} opacity={0.4} fill="none">
      <line x1={140} y1={0} x2={140} y2={VIEW.height} strokeDasharray="4 9" />
      <line x1={660} y1={0} x2={660} y2={VIEW.height} strokeDasharray="4 9" />
      <line x1={0} y1={FLOOR_Y} x2={VIEW.width} y2={FLOOR_Y} strokeWidth={1.6} opacity={1} />
      <path d="M20 20h24M20 20v24" opacity={0.8} />
      <path d="M780 20h-24M780 20v24" opacity={0.8} />
    </g>
  )
}

export function BeforeAfterScene({ variant, className }: { variant: Variant; className?: string }) {
  const before = variant === 'before'

  return (
    <svg
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`ba-wall-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={before ? '#141810' : '#0c1c29'} />
          <stop offset="1" stopColor={before ? '#0b0f0a' : '#08141f'} />
        </linearGradient>
        {before ? (
          <radialGradient id="ba-stain">
            <stop offset="0" stopColor={RUST.stain} stopOpacity="0.7" />
            <stop offset="1" stopColor={RUST.stain} stopOpacity="0" />
          </radialGradient>
        ) : null}
      </defs>

      <rect width={VIEW.width} height={VIEW.height} fill={`url(#ba-wall-${variant})`} />
      <GuideLines />

      {before ? (
        <g>
          <ellipse cx={JOINT_CX + 8} cy={360} rx={130} ry={150} fill="url(#ba-stain)" />
          <path
            d={`M${JOINT_CX - 12} ${PIPE_Y + 16} q -6 60 -15 150`}
            stroke={RUST.stain}
            strokeWidth={10}
            opacity={0.4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${JOINT_CX + 22} ${PIPE_Y + 16} q 9 70 3 160`}
            stroke={RUST.stain}
            strokeWidth={7}
            opacity={0.32}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : null}

      {before ? <RustyPipe d={PIPE_D} /> : <CleanPipe d={PIPE_D} />}

      {/* Joint / union, centred on JOINT_CX */}
      {before ? (
        <g transform={`translate(${JOINT_CX} ${PIPE_Y}) rotate(-4)`}>
          <path
            d="M-26 -20 L-14 -30 H14 L26 -20 V20 L14 30 H-14 L-26 20 Z"
            fill={RUST.shadow}
            stroke="#4a4030"
            strokeWidth={3}
          />
          <path
            d="M-26 -20 L-14 -30 H14 L26 -20 V20 L14 30 H-14 L-26 20 Z"
            fill="none"
            stroke={RUST.rust}
            strokeWidth={2}
            opacity={0.75}
          />
          <path d="M-10 -30 V30 M10 -30 V30" stroke={RUST.verdigris} strokeWidth={1.4} opacity={0.55} />
        </g>
      ) : (
        <g>
          <rect
            x={JOINT_CX - 24}
            y={PIPE_Y - 15}
            width={48}
            height={30}
            rx={6}
            fill={TUBE.cavity}
            stroke={TUBE.shadow}
            strokeWidth={4}
          />
          <rect
            x={JOINT_CX - 24}
            y={PIPE_Y - 15}
            width={48}
            height={30}
            rx={6}
            fill="none"
            stroke={TUBE.copper}
            strokeWidth={2.4}
          />
          <path
            d={`M${JOINT_CX - 14} ${PIPE_Y - 15} V ${PIPE_Y + 15} M${JOINT_CX + 14} ${PIPE_Y - 15} V ${PIPE_Y + 15}`}
            stroke={TUBE.highlight}
            strokeWidth={1.4}
            opacity={0.4}
          />
        </g>
      )}

      {before ? (
        <g>
          <path
            d={`M${JOINT_CX} ${PIPE_Y + 30} q -2 40 -1 66`}
            stroke={RUST.stain}
            strokeWidth={3}
            opacity={0.6}
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={JOINT_CX} cy={PIPE_Y + 58} rx={3.4} ry={5} fill={RUST.verdigris} opacity={0.85} />
          <ellipse cx={JOINT_CX + 3} cy={PIPE_Y + 92} rx={3} ry={4.4} fill={RUST.verdigris} opacity={0.7} />
          <ellipse cx={JOINT_CX} cy={PUDDLE_CY} rx={54} ry={13} fill={RUST.stain} />
          <ellipse cx={JOINT_CX} cy={PUDDLE_CY} rx={54} ry={13} fill="none" stroke="#3a4530" strokeWidth={1.5} opacity={0.5} />
          <ellipse cx={JOINT_CX} cy={PUDDLE_CY - 4} rx={30} ry={7} fill="none" stroke={RUST.verdigris} strokeWidth={1} opacity={0.4} />
        </g>
      ) : null}

      {/* Valve, spanning VALVE_X0..VALVE_X1 */}
      {before ? (
        <g>
          <rect
            x={VALVE_X0}
            y={PIPE_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill={RUST.shadow}
            stroke="#4a4030"
            strokeWidth={4}
          />
          <rect
            x={VALVE_X0}
            y={PIPE_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill="none"
            stroke={RUST.iron}
            strokeWidth={2.4}
          />
          <g transform={`translate(${VALVE_HANDLE_X} ${PIPE_Y}) rotate(18)`}>
            <path d="M-4 0 H34" stroke="#4a4030" strokeWidth={9} strokeLinecap="round" />
            <path d="M-4 0 H34" stroke={RUST.rust} strokeWidth={5.5} strokeLinecap="round" />
            <circle cx="-4" cy="0" r="7" fill={RUST.shadow} stroke={RUST.iron} strokeWidth={2} />
          </g>
        </g>
      ) : (
        <g>
          <rect
            x={VALVE_X0}
            y={PIPE_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill={TUBE.cavity}
            stroke={TUBE.shadow}
            strokeWidth={4}
          />
          <rect
            x={VALVE_X0}
            y={PIPE_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill="none"
            stroke={TUBE.copper}
            strokeWidth={2.6}
          />
          <g transform={`translate(${VALVE_HANDLE_X} ${PIPE_Y})`}>
            <path d="M-4 0 H34" stroke={TUBE.shadow} strokeWidth={9} strokeLinecap="round" />
            <path d="M-4 0 H34" stroke={TUBE.copper} strokeWidth={5.5} strokeLinecap="round" />
            <circle cx="-4" cy="0" r="7" fill={TUBE.cavity} stroke={TUBE.copper} strokeWidth={2} />
          </g>
          <circle cx={VALVE_HANDLE_X} cy={PIPE_Y} r={2} fill={TUBE.water} opacity={0.75} />
        </g>
      )}
    </svg>
  )
}
