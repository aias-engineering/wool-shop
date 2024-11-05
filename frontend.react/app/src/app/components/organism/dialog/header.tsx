'use client'


import './_dialog.css'
import * as React from 'react'
import clsx from 'clsx'

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx('dialog-header', className )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"