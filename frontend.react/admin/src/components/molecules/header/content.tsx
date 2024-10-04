import { ReactNode } from "react"

interface Props {
  children?: ReactNode
}

const HeaderContent = ({children}: Props) => (
  <div className="header__content">
    {children}
  </div>
)

export default HeaderContent