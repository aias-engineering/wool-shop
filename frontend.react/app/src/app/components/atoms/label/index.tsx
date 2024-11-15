import HasChildren from '@/lib/client/react/has-children'
import './_label.css'
export { toId } from '@/app/components/atoms/input'

interface Props extends HasChildren {
  htmlFor: string
}

export default function Label({ htmlFor, children }: Props) {
  return (
    <label htmlFor={htmlFor} className="label">
      {children}
    </label>
  )
}
