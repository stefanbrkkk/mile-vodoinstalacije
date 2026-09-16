import { useId, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { useFinePointer, useReducedMotion } from '@/lib/motion'
import { site, type Service } from '@/config/site'
import { SectionHeader } from '@/components/SectionHeader'
import { ServiceIcon } from '@/components/svg/ServiceIcons'
import { cn } from '@/lib/utils'

/** Max tilt in degrees for the fine-pointer hover effect. */
const MAX_TILT = 6

const SIZE_CLASSES: Record<NonNullable<Service['size']> | 'default', string> = {
  default: '',
  wide: 'md:col-span-2',
  tall: 'md:row-span-2',
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className={cn('[perspective:1200px]', SIZE_CLASSES[service.size ?? 'default'])}>
      <article
        data-card=""
        className="group gpu panel relative flex h-full flex-col gap-5 overflow-hidden p-6 motion-safe:transition-transform motion-safe:duration-300 md:p-7"
      >
        {/* Cursor spotlight: position set from JS via --mx/--my, visibility from data-active. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100"
          style={{
            background:
              'radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgb(63 197 240 / 0.1), transparent 70%)',
          }}
        />
        <ServiceIcon icon={service.icon} className="relative h-8 w-8 text-copper md:h-9 md:w-9" />
        <div className="relative">
          <h3 className="display-md text-text">{service.title}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{service.description}</p>
        </div>
      </article>
    </div>
  )
}

/**
 * "Usluge": an asymmetric bento grid built from `site.services`. Native CSS grid with
 * `grid-auto-flow: dense` packs the wide/tall cards; on a fine pointer, hovering a card
 * adds a light 3D tilt and a cyan spotlight (one delegated listener on the grid).
 */
export function Services() {
  const reducedMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const headingId = useId()
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Reveal the grid once, staggered, when it scrolls into view. Hidden state is set here
  // (never via a CSS class), so the cards stay visible if this effect never runs.
  useGsap(() => {
    if (reducedMotion) return
    const grid = gridRef.current
    if (!grid) return
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]'))
    if (!cards.length) return

    gsap.set(cards, { autoAlpha: 0, y: 28 })
    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(cards, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 })
      },
    })
    return () => trigger.kill()
  }, [reducedMotion])

  // Tilt + spotlight: fine pointers only, one pointermove listener delegated over the grid.
  useGsap(() => {
    if (reducedMotion || !finePointer) return
    const grid = gridRef.current
    if (!grid) return
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]'))
    if (!cards.length) return

    const quickies = new Map(
      cards.map((card) => [
        card,
        {
          rx: gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power3.out' }),
          ry: gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power3.out' }),
        },
      ]),
    )
    let active: HTMLElement | null = null

    const reset = (card: HTMLElement) => {
      quickies.get(card)?.rx(0)
      quickies.get(card)?.ry(0)
      card.dataset.active = 'false'
    }

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      const card = target.closest<HTMLElement>('[data-card]')
      if (card !== active) {
        if (active) reset(active)
        active = card
      }
      if (!card) return
      const rect = card.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width
      const relY = (e.clientY - rect.top) / rect.height
      card.style.setProperty('--mx', `${relX * 100}%`)
      card.style.setProperty('--my', `${relY * 100}%`)
      card.dataset.active = 'true'
      const q = quickies.get(card)
      q?.ry((relX - 0.5) * 2 * MAX_TILT)
      q?.rx((0.5 - relY) * 2 * MAX_TILT)
    }
    const onLeave = () => {
      if (active) reset(active)
      active = null
    }

    grid.addEventListener('pointermove', onMove)
    grid.addEventListener('pointerleave', onLeave)
    return () => {
      grid.removeEventListener('pointermove', onMove)
      grid.removeEventListener('pointerleave', onLeave)
    }
  }, [reducedMotion, finePointer])

  return (
    <section
      id="usluge"
      className="container-x scroll-mt-[var(--nav-height)] py-24 md:py-32"
      aria-labelledby={headingId}
    >
      <SectionHeader index="04" id={headingId} title={site.nav[0].label} />

      <div ref={gridRef} className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 md:[grid-auto-flow:dense]">
        {site.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  )
}
