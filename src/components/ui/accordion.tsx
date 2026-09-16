import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b border-line', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex min-h-14 flex-1 items-center justify-between gap-6 py-5 text-left font-display text-lg font-700 tracking-[-0.01em] text-text transition-colors hover:text-water md:text-xl',
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="relative grid size-8 shrink-0 place-items-center rounded-full border border-line text-water transition-transform duration-300 ease-out group-data-[state=open]:rotate-45"
      >
        <span className="absolute h-[1.5px] w-3.5 rounded bg-current" />
        <span className="absolute h-3.5 w-[1.5px] rounded bg-current" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-muted motion-safe:data-[state=closed]:animate-accordion-up motion-safe:data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-6 pr-12 text-base leading-relaxed', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
