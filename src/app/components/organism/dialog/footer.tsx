'use client'

import './_dialog.css'
import * as React from 'react'
import clsx from 'clsx'

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('dialog-footer', className)} {...props} />
)
DialogFooter.displayName = 'DialogFooter'
