'use client'

import HasChildren from '@/lib/client/react/has-children'
import './_alertable.css'
import { useState } from 'react'
import clsx from 'clsx'

interface AlertableProps extends HasChildren {
  onClick?: () => Promise<void>
}

export default function Alertable({ children }: AlertableProps) {
  return <div className="alertable">{children}</div>
}

export function AlertableAlert({ children }: HasChildren) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={clsx(
        'alertable__alert',
        collapsed && 'alertable__alert--collapsed',
      )}
      onClick={() => setCollapsed(true)}
    >
      {children}
    </div>
  )
}
