import HasChildren from '@/lib/client/react/has-children'
import clsx from 'clsx'
import { MightHaveClassName } from '@/lib/client/react'

interface Props extends HasChildren, MightHaveClassName {}

export default function Grid({ children, className }: Props) {
  return <div className={clsx('grid', className)}>{children}</div>
}
