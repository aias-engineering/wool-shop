import HasChildren from '@/lib/client/react/has-children'
import { MightHaveClassName } from '@/lib/client/react'
import clsx from 'clsx'

interface Props extends HasChildren, MightHaveClassName {}

export default function Paragraph({ children, className }: Props) {
  return <p className={clsx('leading-7', className)}>{children}</p>
}
