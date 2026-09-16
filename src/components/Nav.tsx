import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useIsMobile, useReducedMotion } from '@/lib/motion'
import { useScroll } from '@/lib/scroll-context'
import { cn } from '@/lib/utils'
import { site } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Drop } from '@/components/svg/Drop'

const SECTION_IDS = site.nav.map((link) => link.href.slice(1))
const HIDE_THRESHOLD_PX = 120
const MIN_DELTA = 8
const MENU_ID = 'mobile-menu'
const CLOSE_ANIMATION_MS = 260

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
      <line
        x1="4"
        y1={open ? 12 : 7}
        x2="20"
        y2={open ? 12 : 7}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ transform: open ? 'rotate(45deg)' : 'none', transformOrigin: '12px 12px' }}
        className="transition-transform duration-200 motion-reduce:transition-none"
      />
      <line
        x1="4"
        y1={open ? 12 : 17}
        x2="20"
        y2={open ? 12 : 17}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ transform: open ? 'rotate(-45deg)' : 'none', transformOrigin: '12px 12px' }}
        className="transition-transform duration-200 motion-reduce:transition-none"
      />
    </svg>
  )
}

export function Nav() {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const { lock, unlock } = useScroll()

  const headerRef = useRef<HTMLElement | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [render, setRender] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  // The hamburger only renders below the md breakpoint, so an open menu never survives
  // a resize to desktop in practice — this just guards that edge case defensively.
  const menuActive = open && isMobile
  const menuActiveRef = useRef(menuActive)

  useEffect(() => {
    menuActiveRef.current = menuActive
  }, [menuActive])

  const openMenu = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setRender(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
  }, [])

  const closeMenu = useCallback(() => {
    setOpen(false)
    closeTimerRef.current = window.setTimeout(
      () => {
        setRender(false)
        closeTimerRef.current = null
      },
      reducedMotion ? 0 : CLOSE_ANIMATION_MS,
    )
  }, [reducedMotion])

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
  }, [])

  // Scroll lock, focus management and key handling while the panel is open.
  useEffect(() => {
    if (!menuActive) return
    lock()
    firstLinkRef.current?.focus()
    const hamburger = hamburgerRef.current

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      // The header's own toggle (now the close button) stays visible above the panel and is part of the cycle.
      const focusable = [hamburger, ...Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))].filter(
        (el): el is HTMLElement => !!el,
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      unlock()
      hamburger?.focus()
    }
  }, [menuActive, lock, unlock, closeMenu])

  // Glass background after ~24px, hide-on-scroll-down / show-on-scroll-up with a threshold.
  useGsap(() => {
    const header = headerRef.current
    if (!header) return
    gsap.set(header, { y: 0 })
    let lastY = window.scrollY
    let hidden = false
    const show = () => {
      if (!hidden) return
      hidden = false
      gsap.to(header, { y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
    }
    // Keyboard users tabbing into a hidden header get it back at once, without any scroll event.
    header.addEventListener('focusin', show)

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setScrolled(y > 24)
        if (reducedMotion || menuActiveRef.current || header.contains(document.activeElement)) return

        const delta = y - lastY
        if (y < HIDE_THRESHOLD_PX) {
          if (hidden) {
            hidden = false
            gsap.to(header, { y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
          }
          lastY = y
          return
        }
        if (Math.abs(delta) < MIN_DELTA) return
        if (self.direction === 1 && !hidden) {
          hidden = true
          gsap.to(header, { y: '-100%', duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
        } else if (self.direction === -1 && hidden) {
          hidden = false
          gsap.to(header, { y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
        }
        lastY = y
      },
    })

    return () => {
      header.removeEventListener('focusin', show)
      trigger.kill()
    }
  }, [reducedMotion])

  // Never let the header stay hidden while the mobile menu is open.
  useGsap(() => {
    const header = headerRef.current
    if (menuActive && header) gsap.to(header, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
  }, [menuActive])

  // Cheap "current section" tracking for aria-current on desktop nav links.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((section) => io.observe(section))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={cn('fixed inset-x-0 top-0 z-50 h-[var(--nav-height)]', scrolled ? 'glass' : 'bg-transparent')}
      >
        <div className="container-x flex h-full items-center justify-between">
          <a href="#vrh" className="flex min-h-11 items-center gap-2 font-display text-2xl font-extrabold text-text">
            <Drop className="h-4 w-4 text-copper" />
            {site.wordmark}
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Glavna navigacija">
            {site.nav.map((link) => {
              const id = link.href.slice(1)
              const current = activeId === id
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? 'true' : undefined}
                  className={cn(
                    'relative py-2 text-sm transition-colors',
                    current ? 'text-text' : 'text-muted hover:text-text',
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-water transition-transform duration-300',
                      current && 'scale-x-100',
                    )}
                  />
                </a>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {site.phone ? (
              <Button asChild variant="outline">
                <a href={`tel:${site.phone}`}>{site.phone}</a>
              </Button>
            ) : null}
            <Button asChild variant="primary">
              <a href={site.cta.primary.href}>{site.cta.primary.label}</a>
            </Button>
          </div>

          <button
            ref={hamburgerRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-text md:hidden"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? 'Zatvori meni' : 'Otvori meni'}
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </header>

      {/* Rendered as a header sibling, not a child: GSAP sets an inline transform on the
          header for the hide/show animation, and a transformed ancestor would otherwise
          become the containing block for this panel's `fixed` positioning. */}
      {render ? (
        <div
          ref={panelRef}
          id={MENU_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Meni"
          className={cn(
            'fixed inset-0 z-40 flex flex-col bg-ink px-[var(--gutter)] pt-[var(--nav-height)] pb-10 md:hidden',
            'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
            open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          )}
        >
          <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Meni">
            {site.nav.map((link, i) => (
              <a
                key={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                href={link.href}
                className="display-md flex min-h-11 items-center border-b border-line py-4 text-text"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-4 pt-6">
            <Button asChild variant="primary" size="lg" onClick={closeMenu}>
              <a href={site.cta.primary.href}>{site.cta.primary.label}</a>
            </Button>
            {site.phone ? (
              <Button asChild variant="outline" size="lg" onClick={closeMenu}>
                <a href={`tel:${site.phone}`}>{site.phone}</a>
              </Button>
            ) : null}
            <p className="label-mono text-muted">{site.hours}</p>
          </div>
        </div>
      ) : null}
    </>
  )
}
