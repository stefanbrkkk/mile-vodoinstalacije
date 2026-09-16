import { forwardRef, type SVGProps } from 'react'

/**
 * Large 90-degree copper elbow: two straight arms joined at a bend, a flange at the
 * open top end, a highlight along the outer edges and a few water beads at the bend.
 * Purely decorative background illustration for the hero.
 */
export const HeroElbow = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function HeroElbow(
  { className, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 420 420"
      className={className}
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="mile-elbow-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8944B" />
          <stop offset="55%" stopColor="#D9823B" />
          <stop offset="100%" stopColor="#9C5B24" />
        </linearGradient>
        <linearGradient id="mile-elbow-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* horizontal arm */}
      <rect x="20" y="220" width="340" height="130" rx="18" fill="url(#mile-elbow-body)" />
      {/* vertical arm */}
      <rect x="250" y="20" width="130" height="330" rx="18" fill="url(#mile-elbow-body)" />
      {/* shading in the bend for depth */}
      <rect x="250" y="220" width="130" height="130" fill="url(#mile-elbow-shadow)" />

      {/* flange at the open top end */}
      <rect x="238" y="6" width="154" height="34" rx="10" fill="#B96B2E" stroke="#6E3E17" strokeWidth="2" />
      <circle cx="255" cy="23" r="4" fill="#6E3E17" />
      <circle cx="375" cy="23" r="4" fill="#6E3E17" />

      {/* highlight along the outer edges */}
      <path d="M266 40 L266 330" stroke="#F2B885" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <path d="M36 236 L330 236" stroke="#F2B885" strokeWidth="6" strokeLinecap="round" opacity="0.4" />

      {/* outline */}
      <rect x="20" y="220" width="340" height="130" rx="18" fill="none" stroke="#5C3213" strokeWidth="2" opacity="0.6" />
      <rect x="250" y="20" width="130" height="330" rx="18" fill="none" stroke="#5C3213" strokeWidth="2" opacity="0.6" />

      {/* water beads */}
      <circle cx="150" cy="300" r="6" fill="#3FC5F0" opacity="0.85" />
      <circle cx="112" cy="317" r="3.5" fill="#3FC5F0" opacity="0.6" />
      <circle cx="182" cy="323" r="3" fill="#3FC5F0" opacity="0.5" />
    </svg>
  )
})
