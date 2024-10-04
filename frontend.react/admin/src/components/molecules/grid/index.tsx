import React, { ReactNode } from 'react'
import './_grid.css'

interface Props {
  children?: ReactNode
}

const Grid = ({children}: Props) => (
  <div className='grid'>
    {children}
  </div>
)

export default Grid