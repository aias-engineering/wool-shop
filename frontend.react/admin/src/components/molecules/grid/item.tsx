import { ReactNode } from 'react'
import classNames from 'clsx'
import './_item.css'

interface Props {
  columnSpan?: number,
  children?: ReactNode
}

const GridItem = ({columnSpan, children}: Props) => (
  <div 
    className={classNames("grid__item", columnSpan && `grid__item--span-${columnSpan}`)}>
    {children}
  </div>
)

export default GridItem