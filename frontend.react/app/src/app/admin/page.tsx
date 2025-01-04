import Main from '@/app/components/main'
import Title from '@/app/components/atoms/title'
import HeaderLayout from '../components/layout/header'
import Link from 'next/link'

async function Page() {
  return (
    <>
      <HeaderLayout>
        <Title type='h2' className='text-white'>
          AdminUI
        </Title>
      </HeaderLayout>
      <Main>
        <Link href='/admin/product'>producten</Link>
      </Main>
    </>
  )
}

export default Page
