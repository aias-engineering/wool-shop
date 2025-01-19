import { ReactNode } from 'react'
import './_body.css'

interface Props {
  children?: ReactNode
}

export default function Body({ children }: Props) {
  return <div className="body">{children}</div>
}
