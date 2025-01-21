import { HasChildren } from '@/lib/client/react'
import Logo from '@/app/components/atoms/logo'
import Title from '@/app/components/atoms/title'
import Header from '@/app/components/header'

const AdminHeaderLayout = ({ children }: HasChildren) => (
  <>
    <Header>
      <Title type="h1">
        <Logo />
        Naqab Bedouin Design
      </Title>
      {children}
    </Header>
  </>
)

export default AdminHeaderLayout
