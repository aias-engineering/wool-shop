import './_textarea.css'
import { toId } from '../input'
import clsx from 'clsx'
import { HasChildren, MightHaveClassName } from '@/lib/client/react'

interface Props extends HasChildren, MightHaveClassName {
  name: string
  id?: string
  className?: string
  defaultValue?: string
  disabled?: boolean
}

export default function Textarea({
  name,
  id,
  className,
  children,
  defaultValue,
  disabled,
}: Props) {
  return (
    <textarea
      name={name}
      id={id || toId(name)}
      className={clsx('textarea', className)}
      disabled={disabled}
      defaultValue={defaultValue}
    >
      {children}
    </textarea>
  )
}
