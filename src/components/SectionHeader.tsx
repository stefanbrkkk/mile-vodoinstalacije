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

/** Number of "sheets" (sections) in the technical-drawing numbering shown in the label. */
const TOTAL_SHEETS = '09'

/** Consistent section heading: mono sheet label, display title, optional intro line. */
export function SectionHeader({ index, title, intro, id, className, align = 'left' }: Props) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className="label-mono mb-4 flex items-center gap-3">
        <span>
          List <span className="text-water">{index}</span> / {TOTAL_SHEETS}
        </span>
        <span aria-hidden="true" className="h-px w-10 bg-line" />
      </p>
      <h2 id={id} className="display-lg text-text">
        {title}
      </h2>
      {intro ? <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{intro}</p> : null}
    </div>
  )
}
