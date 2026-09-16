import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import { gsap } from './gsap'

type Setup = (ctx: gsap.Context) => void | (() => void)

/**
 * Runs GSAP setup inside a gsap.context scoped to `scope` and reverts it on cleanup
 * (kills tweens/ScrollTriggers created inside, restores inline styles). StrictMode safe.
 */
export function useGsap(setup: Setup, deps: DependencyList = [], scope?: RefObject<Element | null>) {
  useLayoutEffect(() => {
    let cleanup: void | (() => void)
    const ctx = gsap.context((self) => {
      cleanup = setup(self)
    }, scope?.current ?? undefined)
    return () => {
      cleanup?.()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
