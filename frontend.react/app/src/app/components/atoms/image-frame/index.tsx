import { HasChildren, MightHaveClassName } from '@/lib/client/react'
import clsx from 'clsx'

export default function ImageFrame({
  children,
  className,
}: HasChildren & MightHaveClassName) {
  return (
    <div
      className={clsx(
        'image-frame grid justify-center overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
