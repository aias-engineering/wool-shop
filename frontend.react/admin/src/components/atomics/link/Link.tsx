import React from "react"
import "./_link.css"

interface Props {
    to: string,
    children?: React.ReactNode
}

const Link = ({to, children}: Props) => (
  <>
    <a href={to} className="link">{children}</a>  
  </>
)

export default Link