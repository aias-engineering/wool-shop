'use client'

import './_dialog.css'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { DialogOverlay } from './overlay'
import { X } from 'lucide-react'
import clsx from 'clsx'

export const DialogClose = DialogPrimitive.DialogClose

export const DialogPortal = DialogPrimitive.DialogPortal

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={clsx('dialog-content', className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="dialog-close">
        <X className="dialog-close__x" />
        <span className="dialog-close__sr">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName
