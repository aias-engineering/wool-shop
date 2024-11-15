import HasChildren from '@/lib/client/react/has-children'
import './_grid.css'
import clsx from 'clsx'

interface Props extends HasChildren {
  className?: string
}

export default function Grid({ children, className }: Props) {
  return <div className={clsx('grid', className)}>{children}</div>
}
