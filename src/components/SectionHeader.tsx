import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  /** Sheet number in the "technical drawing" system, e.g. "03". */
  index: string
  title: ReactNode
  intro?: ReactNode
  id?: string
  className?: string
  align?: 'left' | 'center'
}

/** Consistent section heading: mono sheet label, display title, optional intro line. */
export function SectionHeader({ index, title, intro, id, className, align = 'left' }: Props) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className="label-mono mb-4 flex items-center gap-3">
        <span className="text-water">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line" />
        <span>list</span>
      </p>
      <h2 id={id} className="display-lg text-text">
        {title}
      </h2>
      {intro ? <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{intro}</p> : null}
    </div>
  )
}
