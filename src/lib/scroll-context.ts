import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

export type ScrollTarget = string | HTMLElement | number

export type ScrollApi = {
  /** Smooth-scrolls (Lenis) or jumps (reduced motion / no Lenis) to a hash, element or pixel offset. */
  scrollTo: (target: ScrollTarget, opts?: { immediate?: boolean; offset?: number; focus?: boolean }) => void
  /** Debounced ScrollTrigger.refresh(); call after layout changes that ScrollTrigger cannot see. */
  requestRefresh: () => void
  /** Stops page scrolling (mobile menu). Safe to call twice. */
  lock: () => void
  unlock: () => void
  /** Current Lenis instance, or null when reduced motion is on. */
  getLenis: () => Lenis | null
  reducedMotion: boolean
}

export const ScrollContext = createContext<ScrollApi | null>(null)

export function useScroll(): ScrollApi {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScroll must be used inside <ScrollProvider>')
  return ctx
}
