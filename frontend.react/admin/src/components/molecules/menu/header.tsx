import { ReactNode } from "react"
import './_header.css'

interface Props {
    children?: ReactNode
}

const MenuHeader = ({children}: Props) => (
    <div className="menu__header">
        {children}
    </div>
)

export default MenuHeader