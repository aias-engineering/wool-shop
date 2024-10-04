import { ReactNode } from 'react'
import classNames from 'clsx'
import './_container.css'

interface Props {
  className?: string,
  children?: ReactNode
}

const Container = ({className, children}: Props) => (
  <div className={classNames('container', className)}>
    {children}
  </div>
)

export default Container