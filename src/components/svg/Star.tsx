import { cn } from '@/lib/utils'

const STAR_PATH =
  'M10 1.6l2.47 5.15 5.63.72-4.1 3.92 1.08 5.6L10 14.1l-5.08 2.9 1.08-5.6-4.1-3.92 5.63-.72Z'

/** Single five-point star glyph, filled or outlined. Always decorative on its own. */
export function Star({ className, filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false">
      <path
        d={STAR_PATH}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.3}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A row of five stars representing a 1–5 rating. The row itself carries the accessible label. */
export function StarRating({ rating, className }: { rating: 1 | 2 | 3 | 4 | 5; className?: string }) {
  return (
    <div role="img" aria-label={`${rating} od 5 zvezdica`} className={cn('flex items-center gap-1 text-copper', className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i < rating} className="h-3.5 w-3.5" />
      ))}
    </div>
  )
}
