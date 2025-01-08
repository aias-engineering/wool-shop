import Paragraph from '@/app/components/atoms/paragraph'
import Title from '@/app/components/atoms/title'
import HeaderLayout from '@/app/components/layout/header'
import Main from '@/app/components/main'
import Link from 'next/link'

async function Page() {
  return (
    <>
      <HeaderLayout>
        <Title type="h2" className="text-white">
          AdminUI
        </Title>
      </HeaderLayout>
      <Main>
        <Paragraph>
          Hallo en welkom bij je AdminUI Hier kun je je producten beheren en de
          wensenlistjes bekijken
        </Paragraph>
        <ul>
          <li>
            <Link href="/admin/product">producten</Link>
          </li>
          <li>
            <Link href="/admin/wishlist">wensenlistjes</Link>
          </li>
        </ul>
      </Main>
    </>
  )
}

export default Page
