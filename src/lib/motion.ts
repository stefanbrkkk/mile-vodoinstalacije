import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const MOBILE_QUERY = '(max-width: 767px)'
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
export const SHORT_VIEWPORT_QUERY = '(max-height: 640px)'

function getMatch(query: string) {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

/** Subscribes to a media query; re-renders on change. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => getMatch(query),
    () => false,
  )
}

export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY)
}

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY)
}

export function useFinePointer(): boolean {
  return useMediaQuery(FINE_POINTER_QUERY)
}

export function prefersReducedMotion(): boolean {
  return getMatch(REDUCED_MOTION_QUERY)
}

/**
 * True once the element comes within `rootMargin` of the viewport (stays true).
 * Use to defer heavy animation setup while the layout is already reserved.
 */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = '50% 0px'): boolean {
  const [near, setNear] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, near])
  return near
}

/** Visibility of an element (for pausing off-screen loops). */
export function useOnScreen(ref: RefObject<Element | null>, rootMargin = '10% 0px'): boolean {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => setVisible(entries.some((e) => e.isIntersecting)), {
      rootMargin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return visible
}
