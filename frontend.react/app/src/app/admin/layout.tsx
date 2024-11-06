import { ReactNode } from "react"
import Body from "../components/layout/body"
import HeaderLayout from "../components/layout/header"
import Main from "../components/main"

interface Props {
  children?: ReactNode
}

const Layout = ({children}: Props) => (
  <>
    <HeaderLayout></HeaderLayout>
    <Body>  
      <Main>
        {children}
      </Main>
    </Body>
  </>
)

export default Layout