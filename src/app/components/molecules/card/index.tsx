import HasChildren from '@/lib/client/react/has-children'
import './_card.css'
import clsx from 'clsx'
import MightHaveClassName from '@/lib/client/react/might-have-className'

export function Card({
  className,
  children,
}: HasChildren & MightHaveClassName) {
  return <div className={clsx('card', className)}>{children}</div>
}

export function CardHeader({
  className,
  children,
}: HasChildren & MightHaveClassName) {
  return <div className={clsx('card__header', className)}>{children}</div>
}

export function CardTitle({
  className,
  children,
}: HasChildren & MightHaveClassName) {
  return <div className={clsx('card__title', className)}>{children}</div>
}

export function CardDescription({
  className,
  children,
}: HasChildren & MightHaveClassName) {
  return <div className={clsx('card__description', className)}>{children}</div>
}

export function CardContent({
  className,
  children,
}: HasChildren & MightHaveClassName) {
  return <div className={clsx('card__content', className)}>{children}</div>
}

export function CardFooter({
  className,
  children,
}: HasChildren & MightHaveClassName) {
  return <div className={clsx('flex px-6 pb-6', className)}>{children}</div>
}
