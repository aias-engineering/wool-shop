import { HasChildren, MightHaveClassName } from '@/lib/client/react'
import Main from '../../main'
import Title from '../../atoms/title'
import Paragraph from '../../atoms/paragraph'
import { Separator } from '../../atoms/separator'
import { Navigation, NavigationLink } from '../../molecules/navigation'

interface Props extends HasChildren, MightHaveClassName {}

export function AdminMain({ children }: Props) {
  return (
    <Main>
      <Title type="h2">AdminUI</Title>
      <Paragraph>
        Hier kun je je producten beheren en de wensenlistjes bekijken
      </Paragraph>
      <Separator className="my-4" />
      <div className="flex flex-col md:flex-row">
        <div className="pb-4">
          <Navigation className="md:flex-col md:w-40 lg:w-60">
            <NavigationLink href="/admin">Home</NavigationLink>
            <NavigationLink href="/admin/product">Producten</NavigationLink>
            <NavigationLink href="/admin/wishlist">
              Wensenlistjes
            </NavigationLink>
            <NavigationLink href="/admin/image">Afbeeldingen</NavigationLink>
          </Navigation>
        </div>
        <section className="md:pl-10 w-full">{children}</section>
      </div>
    </Main>
  )
}
