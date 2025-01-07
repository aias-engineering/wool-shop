import Logo from '@/app/components/atoms/logo'
import Title from '@/app/components/atoms/title'
import Header from '@/app/components/header'
import { HasChildren } from '@/lib/client/react'

const HeaderLayout = ({ children }: HasChildren) => (
  <>
    <Header>
      <Title type="h1" className="text-white">
        <Logo />
        Naqab Bedouin Design
      </Title>
      {children}
    </Header>
  </>
)

export default HeaderLayout
