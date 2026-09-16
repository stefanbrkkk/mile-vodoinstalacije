import { useId } from 'react'
import { site } from '@/config/site'
import { SectionHeader } from '@/components/SectionHeader'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

function faqIndex(i: number) {
  return `0${i + 1}`
}

/** "Pitanja": a single-open accordion over `site.faq.items`, indexed 01–05. */
export function Faq() {
  const headingId = useId()

  return (
    <section
      id="pitanja"
      className="container-x scroll-mt-[var(--nav-height)] py-24 md:py-32"
      aria-labelledby={headingId}
    >
      <SectionHeader index="08" id={headingId} title={site.faq.title} />

      <Accordion type="single" collapsible className="mt-12 max-w-[44rem]">
        {site.faq.items.map((item, i) => (
          <AccordionItem key={item.question} value={`item-${i}`}>
            <AccordionTrigger>
              <span className="flex items-baseline gap-4">
                <span className="label-mono shrink-0 text-water">{faqIndex(i)}</span>
                <span>{item.question}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
