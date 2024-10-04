import { ReactNode } from 'react'
import './_item.css'

interface Props {
  children?: ReactNode
}

const MenuItem = ({children}: Props) => (
  <>
    <div className='menu__item'>
      {children}
    </div>
  </>
)

export default MenuItem