'use client'

import './_dialog.css'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={clsx('dialog-description', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName
