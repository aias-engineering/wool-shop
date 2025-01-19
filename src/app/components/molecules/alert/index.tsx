import './_alert.css'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface AlertProps extends Props {
  className?: string
}

export default function Alert({ children, className }: AlertProps) {
  return (
    <div role="alert" className={clsx('alert', className)}>
      {children}
    </div>
  )
}

interface Props {
  children?: ReactNode
}

export function AlertTitle({ children }: Props) {
  return <h5 className="alert__title">{children}</h5>
}

export function AlertDescription({ children }: Props) {
  return <div className="alert__description">{children}</div>
}
