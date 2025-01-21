import { LangTrigger } from '@/app/components/atoms/lang-trigger'
import Logo from '@/app/components/atoms/logo'
import Title from '@/app/components/atoms/title'
import Header from '@/app/components/header'

const HeaderLayout = () => (
  <>
    <Header className='grid grid-cols-1 md:grid-cols-[90%_auto]'>
        <LangTrigger className='justify-self-end md:order-2' />
        <Title type="h1">
          <Logo></Logo>
          Naqab Bedouin Design
        </Title>
      </Header>
  </>
)

export default HeaderLayout
