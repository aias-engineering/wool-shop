import React, { ReactNode } from 'react'
import './_menu.css'

interface Props {
  children?: ReactNode
}

const Menu = ({children}: Props) => (
  <>
    <div className='menu'>
      {children}
    </div>
  </>
)

export default Menu