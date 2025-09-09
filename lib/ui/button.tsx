import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium',
        outline:
          'border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 hover:border-primary/40 shadow-soft hover:shadow-medium',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-medium hover:shadow-strong',
        success:
          'bg-success text-success-foreground hover:bg-success/90 shadow-soft hover:shadow-medium',
        warning:
          'bg-warning text-warning-foreground hover:bg-warning/90 shadow-soft hover:shadow-medium',
      },
      size: {
        sm: 'h-9 px-3 text-xs rounded-lg',
        default: 'h-11 px-4 py-2 text-sm',
        lg: 'h-12 px-6 py-3 text-base',
        xl: 'h-14 px-8 py-4 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
