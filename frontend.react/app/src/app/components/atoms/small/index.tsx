import HasChildren from '@/lib/client/react/has-children';
import './_small.css'
import clsx from 'clsx';

interface Props extends HasChildren {
  className?: string
}

export default function Small({className, children}: Props) {
  return (
    <small className={clsx('small', className)}>{children}</small>
  )
}