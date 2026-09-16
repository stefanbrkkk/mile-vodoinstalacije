import { TUBE } from './pipe-style'

export type GlyphKind = 'contact' | 'diagnose' | 'repair' | 'warranty'

const COMMON = {
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Small technical line glyphs for the four steps of the process story. */
export function ProcessGlyph({ kind, className }: { kind: GlyphKind; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      {kind === 'contact' ? (
        <g {...COMMON} stroke={TUBE.copper}>
          <path d="M6 12a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H20l-9 8v-8h-1a4 4 0 0 1-4-4Z" />
          <g stroke={TUBE.water}>
            <path d="M16 21h.01M24 21h.01M32 21h.01" strokeWidth="3.2" />
          </g>
        </g>
      ) : null}

      {kind === 'diagnose' ? (
        <g {...COMMON} stroke={TUBE.copper}>
          <path d="M4 34h10M34 14h10" />
          <path d="M14 30h6M28 18h6" strokeOpacity="0.55" />
          <circle cx="24" cy="24" r="11" />
          <path d="M32 32l10 10" />
          <path d="M19 24a5 5 0 0 1 5-5" stroke={TUBE.water} />
        </g>
      ) : null}

      {kind === 'repair' ? (
        <g {...COMMON} stroke={TUBE.copper}>
          <path d="M31 6a10 10 0 0 0-9 15L9 34a4.5 4.5 0 0 0 6 6l13-13a10 10 0 0 0 12-14l-6 6-6-1-1-6Z" />
          <path d="M13 36h.01" strokeWidth="3.2" stroke={TUBE.water} />
        </g>
      ) : null}

      {kind === 'warranty' ? (
        <g {...COMMON} stroke={TUBE.copper}>
          <path d="M24 5l15 6v11c0 10-6.5 17.5-15 21-8.5-3.5-15-11-15-21V11Z" />
          <path d="M17 23.5l5 5 10-10" stroke={TUBE.water} strokeWidth="2.4" />
        </g>
      ) : null}
    </svg>
  )
}
