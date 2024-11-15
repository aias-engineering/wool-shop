import { ReactNode } from 'react'
import './_header.css'

export interface Props {
  children?: ReactNode
}

const Header = ({ children }: Props) => (
  <>
    <header className="header">{children}</header>
  </>
)

export default Header
