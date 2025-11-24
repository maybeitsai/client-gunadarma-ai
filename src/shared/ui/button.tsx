import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary-hover',
        secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/60',
        outline: 'border border-border text-text-primary hover:bg-surface-hover/60 bg-transparent',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-5',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10',
      },
      weight: {
        regular: 'font-medium',
        bold: 'font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      weight: 'bold',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = ({ className, variant, size, weight, asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={clsx(buttonVariants({ variant, size, weight }), className)} {...props} />
}

export { Button }
