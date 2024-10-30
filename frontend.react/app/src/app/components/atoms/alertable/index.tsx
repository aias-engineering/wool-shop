'use client'

import HasReactChildren from '@/lib/system/has-children'
import './_alertable.css'
import { useState } from 'react'
import clsx from 'clsx'

interface AlertableProps extends HasReactChildren {
  onClick?: () => Promise<void>
}

export default function Alertable({children}: AlertableProps) {
  return (
    <div className="alertable">
      {children}
    </div>
  )
}

export function AlertableAlert({children}: HasReactChildren) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={clsx('alertable__alert', (collapsed && 'alertable__alert--collapsed'))} onClick={() => setCollapsed(true)}>
      {children}
    </div>
  )
}