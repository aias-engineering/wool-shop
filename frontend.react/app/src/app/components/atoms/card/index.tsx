import { ReactNode } from "react";
import './_card.css'

interface Props {
  children?: ReactNode
}

export default function Card({children}: Props) {
  return (
    <div className="card">
      {children}
    </div>
  )
}