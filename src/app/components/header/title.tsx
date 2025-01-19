import { ReactNode } from 'react'

export interface Props {
  children?: ReactNode
}

const HeaderTitle = ({ children }: Props) => <div>{children}</div>

export default HeaderTitle
