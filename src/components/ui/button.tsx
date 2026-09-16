import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 font-sans text-[0.95rem] font-medium tracking-[-0.01em] whitespace-nowrap transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /* Copper on dark ink text: 6.1:1 contrast. */
        primary:
          'bg-copper text-ink shadow-glow-copper hover:bg-[#e6903f] hover:shadow-[0_0_70px_-10px_rgb(217_130_59/0.7)]',
        outline: 'border border-line bg-surface/40 text-text hover:border-water/60 hover:bg-surface',
        ghost: 'text-text hover:bg-surface',
      },
      size: {
        default: 'min-h-11',
        lg: 'min-h-13 px-7 text-base',
        icon: 'size-11 px-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  },
)
Button.displayName = 'Button'

