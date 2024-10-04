import { ReactNode } from 'react'
import classNames from 'clsx'
import './_item.css'

interface Props {
  className?: string,
  columnSpan?: number,
  children?: ReactNode,
  padding?: "default" | "h-default" | 'double'
}

const GridItem = ({className, columnSpan, children, padding}: Props) => (
  <div 
    className={classNames(
      "grid__item", 
      columnSpan && `grid__item--span-${columnSpan}`, 
      padding && `grid__item--padding-${padding}`,
      className)}>
    {children}
  </div>
)

export default GridItem