import { forwardRef, type SVGProps } from 'react'

/**
 * Small teardrop glyph reused as a decorative mark: nav wordmark, marquee separators,
 * scroll hint. Always decorative — callers never need to override aria-hidden/focusable.
 */
export const Drop = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Drop(
  { className, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.4c-.34.46-1.2 1.66-2.06 3.1C8.32 8.1 6.4 11.6 6.4 14.2a5.6 5.6 0 0 0 11.2 0c0-2.6-1.92-6.1-3.54-8.7C13.2 4.06 12.34 2.86 12 2.4Z" />
    </svg>
  )
})
