import { HasChildren, MightHaveClassName } from '@/lib/client/react'
import './_image-frame.css'
import clsx from 'clsx'

export default function ImageFrame({
  children,
  className,
}: HasChildren & MightHaveClassName) {
  return <div className={clsx('image-frame', className)}>{children}</div>
}
