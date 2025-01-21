import { HasChildren, MightHaveClassName } from '@/lib/client/react'
import Button from '@/app/components/atoms/button'
import Main from '@/app/components/main'
import Grid from '@/app/components/atoms/grid'
import Title from '@/app/components/atoms/title'
import Paragraph from '@/app/components/atoms/paragraph'
import { Separator } from '@/app/components/atoms/separator'
import {
  Navigation,
  NavigationLink,
} from '@/app/components/molecules/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from '@/auth'

interface Props extends HasChildren, MightHaveClassName {}

export function AdminMain({ children }: Props) {
  return (
    <Main>
      <Grid className="grid-cols-2 py-4 pr-2 gap-4">
        <Title type="h2">AdminUI</Title>
        <div className="justify-self-end">
          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <Button type="submit" variant="outline">
              <LogOut /> uitloggen
            </Button>
          </form>
        </div>
        <Paragraph className="col-span-2">
          Hier kun je je producten beheren en de wensenlistjes bekijken
        </Paragraph>
      </Grid>
      <Separator className="my-4" />
      <div className="flex flex-col md:flex-row">
        <div className="pb-4">
          <Navigation className="md:flex-col md:w-40">
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
