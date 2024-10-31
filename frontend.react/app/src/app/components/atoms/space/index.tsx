import HasChildren from '@/lib/client/react/has-children';
import './_space.css'
import clsx from 'clsx';

interface Props extends HasChildren {
  className?: string
}

export default function Space({className, children}: Props) {
  return (
    <div className={clsx('space', className)}>{children}</div>
  )
}