import { ReactNode } from 'react'
import './_main.css'

interface Props {
  children?: ReactNode
}

const Main = ({ children }: Props) => (
  <>
    <main className="main">{children}</main>
  </>
)

export default Main
