import { ReactNode } from "react"
import classNames from 'clsx'
import "./_title.css"

interface Props {
  as? : 'h1' | 'h2' | 'h3',
  className?: string,
  children?: ReactNode
}

const Title = ({as = 'h1', className, children}: Props) => {
  const Component = as

  return (
    <Component className={classNames("title", `title--${as}`, className)}>{children}</Component>
  )
}

export default Title