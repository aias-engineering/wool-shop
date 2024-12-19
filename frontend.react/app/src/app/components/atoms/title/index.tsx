import HasChildren from '@/lib/client/react/has-children'
import clsx from 'clsx'

interface Props extends HasChildren {
  type: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
}

export default function Title({ type, className, children }: Props) {
  const Component = type
  return (
    <Component 
      className={
        clsx(
          'tracking-tight scroll-m-20', 
          type === 'h1' && 'text-4xl font-extrabold',
          type === 'h2' && 'text-3xl font-semibold',
          type === 'h3' && 'text-2xl font-semibold',
          type === 'h4' && 'text-xl font-semibold',
          className)}>
      {children}
    </Component>
  )
}
