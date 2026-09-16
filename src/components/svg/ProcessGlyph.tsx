import { TUBE } from './pipe-style'

export type GlyphKind = 'contact' | 'diagnose' | 'repair' | 'warranty'

const CORNERS = 'M8 22 V8 H22 M98 8 H112 V22 M8 98 V112 H22 M112 98 V112 H98'

const COPPER = {
  fill: 'none',
  stroke: TUBE.copper,
  strokeWidth: 2.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const ACCENT = {
  fill: 'none',
  stroke: TUBE.water,
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/**
 * Step drawings in the same technical-sheet language as the anatomy assembly:
 * thin guide lines, copper line work, one water-cyan accent. Decorative.
 */
export function ProcessGlyph({ kind, className }: { kind: GlyphKind; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke={TUBE.guide} strokeWidth="1">
        <path d={CORNERS} opacity="0.85" />
        {kind === 'contact' || kind === 'warranty' ? <path d="M60 6 V114" strokeDasharray="4 8" opacity="0.7" /> : null}
        {kind === 'diagnose' ? <path d="M6 64 H114" strokeDasharray="4 8" opacity="0.7" /> : null}
        {kind === 'repair' ? <circle cx="84" cy="34" r="30" strokeDasharray="4 8" opacity="0.7" /> : null}
        {kind === 'warranty' ? <circle cx="60" cy="60" r="46" strokeDasharray="4 8" opacity="0.55" /> : null}
      </g>

      {kind === 'contact' ? (
        <g>
          <path
            {...COPPER}
            d="M26 28 H94 Q102 28 102 36 V72 Q102 80 94 80 H54 L40 94 V80 H26 Q18 80 18 72 V36 Q18 28 26 28 Z"
          />
          <path {...COPPER} strokeWidth="2.2" opacity="0.8" d="M30 45 H78 M30 57 H88" />
          <path {...ACCENT} d="M30 69 H54" />
        </g>
      ) : null}

      {kind === 'diagnose' ? (
        <g>
          <path {...COPPER} d="M12 56 H108 M12 72 H108" />
          <path {...COPPER} d="M46 48 H74 V80 H46 Z" fill={TUBE.cavity} />
          <path {...COPPER} strokeWidth="1.8" opacity="0.55" d="M54 51 V77 M66 51 V77" />
          <circle {...COPPER} cx="62" cy="54" r="30" />
          <path {...COPPER} strokeWidth="4.4" d="M83 75 L104 96" />
          <path {...ACCENT} strokeWidth="2.6" d="M42 50 A 20 20 0 0 1 56 36" />
          <path fill={TUBE.water} d="M60 86 c -5 6 -7 9 -7 12 a 7 7 0 0 0 14 0 c 0 -3 -2 -6 -7 -12 Z" />
        </g>
      ) : null}

      {kind === 'repair' ? (
        <g>
          <path
            {...COPPER}
            d="M77.5 15 a25 25 0 0 0 -22.5 37.5 L22.5 85 a11.25 11.25 0 0 0 15 15 L75 67.5 a25 25 0 0 0 30 -35 l-15 15 l-15 -2.5 l-2.5 -15 Z"
          />
          <path {...ACCENT} strokeWidth="2.6" d="M106 48 A 26 26 0 0 0 100 16" />
          <path {...ACCENT} strokeWidth="2.6" d="M93 18 L100 15 L102 23" />
          <circle cx="33" cy="89" r="4" fill={TUBE.water} />
        </g>
      ) : null}

      {kind === 'warranty' ? (
        <g>
          <path {...COPPER} d="M60 14 L102 30 V56 C102 82 84 98 60 106 C36 98 18 82 18 56 V30 Z" />
          <path {...COPPER} strokeWidth="1.8" opacity="0.5" d="M60 20 L96 34 V56 c0 22 -15 36 -36 44" />
          <path {...ACCENT} strokeWidth="5" d="M41 58 L55 72 L81 44" />
        </g>
      ) : null}
    </svg>
  )
}
