import { ReactNode } from "react"
import HeaderLayout from "../components/layout/header"
import Main from "../components/main"

interface Props {
  children?: ReactNode
}

const Layout = ({children}: Props) => (
  <>
    <HeaderLayout></HeaderLayout>
    <Main>
      {children}
    </Main>
  </>
)

export default Layout