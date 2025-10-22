import clsx from 'clsx'
import './_large.css'
import HasChildren from '@/lib/client/react/has-children'

interface Props extends HasChildren {
  className?: string
}

export default function Large({ className, children }: Props) {
  return <span className={clsx('large', className)}>{children}</span>
}
