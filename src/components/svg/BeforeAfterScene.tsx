import { TUBE } from './pipe-style'
import { Tube } from './PipeDefs'

type Variant = 'before' | 'after'

/**
 * Shared geometry so the two variants line up exactly: a vertical riser at the left comes
 * down off a wall bracket, elbows into a horizontal run, passes an angle valve and a union
 * joint, and continues to the right edge.
 */
const VIEW = { width: 800, height: 460 } as const
const RISER_X = 108
const RISER_TOP = 22
const RUN_Y = 196
const ELBOW_R = 34
const PIPE_D = `M${RISER_X} ${RISER_TOP} V ${RUN_Y - ELBOW_R} Q ${RISER_X} ${RUN_Y} ${RISER_X + ELBOW_R} ${RUN_Y} H 800`
const BRACKET_Y = 92
const JOINT_CX = 300
const VALVE_X0 = 520
const VALVE_X1 = 616
const VALVE_HANDLE_X = 568
const FLOOR_Y = 388
const PUDDLE_CY = 408

const RUST = {
  shadow: '#211a10',
  iron: '#8a8168',
  rust: '#9a4f22',
  rustDeep: '#5e2f10',
  verdigris: '#6c7a52',
  stain: '#04100a',
} as const

/** Fixed, hand-placed corrosion blotches along the riser and the run (deterministic, not random). */
const BLOTCHES: { x: number; y: number; r: number; color: string; opacity: number }[] = [
  { x: RISER_X, y: 52, r: 7, color: RUST.rust, opacity: 0.85 },
  { x: RISER_X, y: 118, r: 5, color: RUST.verdigris, opacity: 0.65 },
  { x: RISER_X + 6, y: 158, r: 6, color: RUST.rustDeep, opacity: 0.8 },
  { x: 210, y: RUN_Y, r: 7, color: RUST.rustDeep, opacity: 0.9 },
  { x: 248, y: RUN_Y, r: 4, color: RUST.rust, opacity: 0.6 },
  { x: 392, y: RUN_Y, r: 6, color: RUST.verdigris, opacity: 0.65 },
  { x: 430, y: RUN_Y, r: 5, color: RUST.rust, opacity: 0.8 },
  { x: 668, y: RUN_Y, r: 7, color: RUST.rustDeep, opacity: 0.85 },
  { x: 706, y: RUN_Y, r: 4, color: RUST.verdigris, opacity: 0.6 },
  { x: 748, y: RUN_Y, r: 6, color: RUST.rust, opacity: 0.75 },
]

/** Weathered copper: a dull iron body under scattered rust/verdigris blotches, not a smooth gradient. */
function RustyPipe() {
  return (
    <g>
      <path d={PIPE_D} stroke={RUST.shadow} strokeWidth={19} strokeLinecap="round" fill="none" />
      <path d={PIPE_D} stroke={RUST.iron} strokeWidth={15} strokeLinecap="round" fill="none" />
      <path d={PIPE_D} stroke={RUST.shadow} strokeWidth={2} opacity={0.4} strokeDasharray="1 5" fill="none" />
      {BLOTCHES.map((b) => (
        <circle key={`${b.x}-${b.y}`} cx={b.x} cy={b.y} r={b.r} fill={b.color} opacity={b.opacity} />
      ))}
    </g>
  )
}

/** Same run, drawn clean: the shared copper Tube plus a faint water-lit core. */
function CleanPipe() {
  return (
    <g>
      <Tube d={PIPE_D} width={15} />
      <path d={PIPE_D} stroke={TUBE.water} strokeWidth={4} strokeOpacity={0.32} strokeLinecap="round" fill="none" />
    </g>
  )
}

/** Wall strap holding the riser in place, corroded or clean. */
function Bracket({ before }: { before: boolean }) {
  const stroke = before ? RUST.iron : TUBE.copper
  const fill = before ? RUST.shadow : TUBE.cavity
  return (
    <g transform={`translate(${RISER_X} ${BRACKET_Y})`}>
      <path d="M-19 -6 H-11 M-19 6 H-11" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" />
      <rect x="-12" y="-7" width="24" height="14" rx="3" fill={fill} stroke={stroke} strokeWidth={before ? 3 : 2.4} />
      <circle cx="-6" cy="0" r="1.5" fill={stroke} />
      <circle cx="6" cy="0" r="1.5" fill={stroke} />
    </g>
  )
}

/** Technical guide lines and a faint tile grid, shared by both variants. */
function GuideLines({ variant }: { variant: Variant }) {
  const tileId = `ba-tiles-${variant}`
  return (
    <g fill="none">
      <pattern id={tileId} width={40} height={40} patternUnits="userSpaceOnUse">
        <path d="M40 0 V40 H0" stroke={TUBE.guide} strokeWidth={1} />
      </pattern>
      <rect width={VIEW.width} height={VIEW.height} fill={`url(#${tileId})`} opacity={0.14} />
      <g stroke={TUBE.guide} strokeWidth={1} opacity={0.4}>
        <line x1={JOINT_CX + 40} y1={0} x2={JOINT_CX + 40} y2={VIEW.height} strokeDasharray="4 9" />
        <line x1={0} y1={FLOOR_Y} x2={VIEW.width} y2={FLOOR_Y} strokeWidth={1.6} opacity={1} />
        <path d="M20 20h24M20 20v24" opacity={0.8} />
        <path d="M780 20h-24M780 20v24" opacity={0.8} />
      </g>
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
          <stop offset="0" stopColor={before ? '#1c2016' : '#123249'} />
          <stop offset="1" stopColor={before ? '#0e100a' : '#08141f'} />
        </linearGradient>
        {before ? (
          <radialGradient id="ba-stain">
            <stop offset="0" stopColor={RUST.stain} stopOpacity="0.85" />
            <stop offset="1" stopColor={RUST.stain} stopOpacity="0" />
          </radialGradient>
        ) : null}
      </defs>

      <rect width={VIEW.width} height={VIEW.height} fill={`url(#ba-wall-${variant})`} />
      <GuideLines variant={variant} />

      {before ? (
        <g>
          <ellipse cx={JOINT_CX + 8} cy={324} rx={130} ry={130} fill="url(#ba-stain)" />
          <path
            d={`M${JOINT_CX - 12} ${RUN_Y + 16} q -6 60 -15 140`}
            stroke={RUST.stain}
            strokeWidth={10}
            opacity={0.4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${JOINT_CX + 22} ${RUN_Y + 16} q 9 60 3 150`}
            stroke={RUST.stain}
            strokeWidth={7}
            opacity={0.32}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : null}

      <Bracket before={before} />
      {before ? <RustyPipe /> : <CleanPipe />}

      {/* Joint / union, centred on JOINT_CX */}
      {before ? (
        <g transform={`translate(${JOINT_CX} ${RUN_Y}) rotate(-4)`}>
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
            y={RUN_Y - 15}
            width={48}
            height={30}
            rx={6}
            fill={TUBE.cavity}
            stroke={TUBE.shadow}
            strokeWidth={4}
          />
          <rect
            x={JOINT_CX - 24}
            y={RUN_Y - 15}
            width={48}
            height={30}
            rx={6}
            fill="none"
            stroke={TUBE.copper}
            strokeWidth={2.4}
          />
          <path
            d={`M${JOINT_CX - 14} ${RUN_Y - 15} V ${RUN_Y + 15} M${JOINT_CX + 14} ${RUN_Y - 15} V ${RUN_Y + 15}`}
            stroke={TUBE.highlight}
            strokeWidth={1.4}
            opacity={0.4}
          />
        </g>
      )}

      {before ? (
        <g>
          <path
            d={`M${JOINT_CX} ${RUN_Y + 30} q -2 34 -1 58`}
            stroke={RUST.stain}
            strokeWidth={3}
            opacity={0.6}
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={JOINT_CX} cy={RUN_Y + 52} rx={3.4} ry={5} fill={RUST.verdigris} opacity={0.85} />
          <ellipse cx={JOINT_CX + 3} cy={RUN_Y + 82} rx={3} ry={4.4} fill={RUST.verdigris} opacity={0.7} />
          <ellipse cx={JOINT_CX} cy={PUDDLE_CY} rx={54} ry={13} fill={RUST.stain} />
          <ellipse cx={JOINT_CX} cy={PUDDLE_CY} rx={54} ry={13} fill="none" stroke="#3a4530" strokeWidth={1.5} opacity={0.5} />
          <ellipse cx={JOINT_CX} cy={PUDDLE_CY - 4} rx={30} ry={7} fill="none" stroke={RUST.verdigris} strokeWidth={1} opacity={0.4} />
        </g>
      ) : null}

      {/* Angle valve, spanning VALVE_X0..VALVE_X1 */}
      {before ? (
        <g>
          <rect
            x={VALVE_X0}
            y={RUN_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill={RUST.shadow}
            stroke="#4a4030"
            strokeWidth={4}
          />
          <rect
            x={VALVE_X0}
            y={RUN_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill="none"
            stroke={RUST.iron}
            strokeWidth={2.4}
          />
          <g transform={`translate(${VALVE_HANDLE_X} ${RUN_Y}) rotate(18)`}>
            <path d="M-4 0 H34" stroke="#4a4030" strokeWidth={9} strokeLinecap="round" />
            <path d="M-4 0 H34" stroke={RUST.rust} strokeWidth={5.5} strokeLinecap="round" />
            <circle cx="-4" cy="0" r="7" fill={RUST.shadow} stroke={RUST.iron} strokeWidth={2} />
          </g>
        </g>
      ) : (
        <g>
          <rect
            x={VALVE_X0}
            y={RUN_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill={TUBE.cavity}
            stroke={TUBE.shadow}
            strokeWidth={4}
          />
          <rect
            x={VALVE_X0}
            y={RUN_Y - 26}
            width={VALVE_X1 - VALVE_X0}
            height={52}
            rx={8}
            fill="none"
            stroke={TUBE.copper}
            strokeWidth={2.6}
          />
          <g transform={`translate(${VALVE_HANDLE_X} ${RUN_Y})`}>
            <path d="M-4 0 H34" stroke={TUBE.shadow} strokeWidth={9} strokeLinecap="round" />
            <path d="M-4 0 H34" stroke={TUBE.copper} strokeWidth={5.5} strokeLinecap="round" />
            <circle cx="-4" cy="0" r="7" fill={TUBE.cavity} stroke={TUBE.copper} strokeWidth={2} />
          </g>
          <circle cx={VALVE_HANDLE_X} cy={RUN_Y} r={2} fill={TUBE.water} opacity={0.75} />
        </g>
      )}
    </svg>
  )
}
