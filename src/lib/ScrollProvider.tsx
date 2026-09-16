import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { useReducedMotion } from './motion'
import { ScrollContext, type ScrollApi, type ScrollTarget } from './scroll-context'

function resolveTarget(target: ScrollTarget): HTMLElement | number | null {
  if (typeof target === 'number') return target
  if (typeof target === 'string') {
    const id = target.startsWith('#') ? target.slice(1) : target
    if (!id) return 0
    return document.getElementById(id)
  }
  return target
}

/**
 * One coordinated update loop: Lenis is driven by gsap.ticker and forwards scroll events to
 * ScrollTrigger. No second rAF loop, no duplicate smooth scrolling. Reverted fully on unmount
 * (StrictMode runs this twice in dev; both instances are destroyed cleanly).
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const refreshTimer = useRef<number | null>(null)
  const lockCount = useRef(0)

  const requestRefresh = useCallback(() => {
    if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current)
    refreshTimer.current = window.setTimeout(() => {
      refreshTimer.current = null
      ScrollTrigger.refresh()
    }, 120)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      // Native scrolling only; ScrollTrigger still receives native scroll events by itself.
      document.documentElement.classList.add('reduced-motion')
      return () => document.documentElement.classList.remove('reduced-motion')
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: false,
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('lenis-active')

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
      document.documentElement.classList.remove('lenis-active')
    }
  }, [reducedMotion])

  // Re-measure when fonts land or the document height changes (accordions, lazy sections).
  useEffect(() => {
    let lastHeight = document.documentElement.scrollHeight
    document.fonts?.ready.then(requestRefresh)
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight
      if (h !== lastHeight) {
        lastHeight = h
        requestRefresh()
      }
    })
    ro.observe(document.body)
    return () => {
      ro.disconnect()
      if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current)
    }
  }, [requestRefresh])

  const scrollTo = useCallback<ScrollApi['scrollTo']>(
    (target, opts) => {
      const resolved = resolveTarget(target)
      if (resolved === null) return
      const lenis = lenisRef.current
      const immediate = opts?.immediate || reducedMotion
      const offset = opts?.offset ?? 0
      if (lenis) {
        lenis.scrollTo(resolved, { offset, immediate, duration: 1.1, lock: true })
      } else {
        const top =
          typeof resolved === 'number' ? resolved : resolved.getBoundingClientRect().top + window.scrollY + offset
        window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
      }
      if (typeof resolved !== 'number' && opts?.focus !== false) {
        // Move keyboard focus to the target section without a second scroll.
        if (!resolved.hasAttribute('tabindex')) resolved.setAttribute('tabindex', '-1')
        resolved.focus({ preventScroll: true })
      }
    },
    [reducedMotion],
  )

  // One delegated handler for every in-page anchor (nav, hero buttons, footer).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const hash = anchor.getAttribute('href') ?? ''
      if (hash.length < 2) {
        e.preventDefault()
        scrollTo(0)
        return
      }
      if (!document.getElementById(hash.slice(1))) return
      e.preventDefault()
      scrollTo(hash)
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scrollTo])

  // Deep link on load: jump once layout has settled.
  useEffect(() => {
    const hash = window.location.hash
    if (hash.length > 1 && document.getElementById(hash.slice(1))) {
      const id = window.setTimeout(() => scrollTo(hash, { immediate: true, focus: false }), 150)
      return () => window.clearTimeout(id)
    }
  }, [scrollTo])

  const lock = useCallback(() => {
    lockCount.current += 1
    if (lockCount.current > 1) return
    lenisRef.current?.stop()
    document.documentElement.style.overflow = 'hidden'
  }, [])

  const unlock = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1)
    if (lockCount.current > 0) return
    document.documentElement.style.overflow = ''
    lenisRef.current?.start()
  }, [])

  const api = useMemo<ScrollApi>(
    () => ({ scrollTo, requestRefresh, lock, unlock, getLenis: () => lenisRef.current, reducedMotion }),
    [scrollTo, requestRefresh, lock, unlock, reducedMotion],
  )

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}
