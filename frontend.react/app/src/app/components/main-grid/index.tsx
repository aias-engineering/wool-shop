import React from "react"
import "./_main-grid.css"

interface Props {
  children?: React.ReactNode
}

export default function MainGrid({children}: Props) {
  return (
  <>
    <div className="main-grid">
      {children}
    </div>
  </>
  )
}