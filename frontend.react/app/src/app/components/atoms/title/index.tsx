import HasChildren from '@/lib/client/react/has-children'
import './_title.css'
import clsx from 'clsx'

interface Props extends HasChildren {
  type: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
}

export default function Title({ type, className, children }: Props) {
  const Component = type
  return (
    <Component className={clsx('title', `title--${type}`, className)}>
      {children}
    </Component>
  )
}
