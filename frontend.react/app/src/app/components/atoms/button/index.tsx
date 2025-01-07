'use client'

import clsx from 'clsx'
import { cva } from 'class-variance-authority'
import { HasChildren, MightHaveClassName } from '@/lib/client/react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ' +
    'font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ' +
    'h-9 px-4 py-2',
  {
    variants: {
      variant: {
        default: 'bg-black text-white shadow hover:bg-black/90 rounded-md',
        outline:
          'border border-input bg-white shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md',
        counter:
          'border border-input bg-white shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface Props extends HasChildren, MightHaveClassName {
  disabled?: boolean
  type?: 'button' | 'submit'
  variant?: 'default' | 'outline' | 'counter'
  onClick?: (() => Promise<void>) | (() => void)
}

const Button = ({
  className,
  children,
  disabled,
  type = 'submit',
  variant,
  onClick,
}: Props) => (
  <>
    <button
      className={clsx(buttonVariants({ variant, className }))}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  </>
)

export default Button
