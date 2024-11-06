import Title from '@/app/components/atoms/title';
import Header from "@/app/components/header";
import Navigation, { NavigationLink } from '@/app/components/molecules/navigation';

const HeaderLayout = () => (
  <>
    <Header>
      <Title type="h1">Naqab Bedouin Design</Title>
      <Title type="h2">Admin UI</Title>
      <Navigation>
        <NavigationLink href='/admin/product'>producten</NavigationLink>
        <NavigationLink href='/admin/image'>afbleedingen</NavigationLink>
      </Navigation>
    </Header>
  </>
)

export default HeaderLayout