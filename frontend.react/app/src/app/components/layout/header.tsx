import { logout } from '@/app/admin/actions'
import Button from '@/app/components/atoms/button'
import Logo from '@/app/components/atoms/logo'
import Title from '@/app/components/atoms/title'
import Header from '@/app/components/header'
import Navigation, {
  NavigationLink,
} from '@/app/components/molecules/navigation'

const HeaderLayout = () => (
  <>
    <Header>
      <form action={logout} className="flex flex-row justify-end">
        <Button>uitloggen</Button>
      </form>
      <Title type="h1" className="text-white">
        <Logo />
        Naqab Bedouin Design
      </Title>
      <Title type="h2" className="text-white">
        Admin UI
      </Title>
      <Navigation>
        <NavigationLink href="/admin/product">producten</NavigationLink>
        <NavigationLink href="/admin/image">afbleedingen</NavigationLink>
      </Navigation>
    </Header>
  </>
)

export default HeaderLayout
