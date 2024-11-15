import HasChildren from '@/lib/client/react/has-children'
import './_textarea.css'
import { toId } from '../input'
import clsx from 'clsx'

interface Props extends HasChildren {
  name: string
  id?: string
  className?: string
}

export default function Textarea({ name, id, className, children }: Props) {
  return (
    <textarea
      name={name}
      id={id || toId(name)}
      className={clsx('textarea', className)}
    >
      {children}
    </textarea>
  )
}
