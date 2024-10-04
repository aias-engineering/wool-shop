import { ReactNode } from "react"
import classNames from 'clsx'
import "./_title.css"

interface Props {
  as? : 'h1' | 'h2',
  children?: ReactNode
}

const Title = ({as = 'h1', children}: Props) => {
  const Component = as

  return (
    <Component className={classNames("title", `title--${as}`)}>{children}</Component>
  )
}

export default Title