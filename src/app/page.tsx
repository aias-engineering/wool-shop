import Logo from '@/app/components/atoms/logo'
import Small from '@/app/components/atoms/small'
import Title from '@/app/components/atoms/title'
import Header from '@/app/components/header'
import ErrorPage from '@/app/components/layout/error-page'
import Main from '@/app/components/main'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getAllProducts } from '@/lib/server/core/products'
import { match, P } from 'ts-pattern'
import ProductsShop from './products-shop'
import { unstable_cache } from 'next/cache'
import { SessionProvider } from 'next-auth/react'
import { LangTrigger } from './components/atoms/lang-trigger'
import { getTranslations } from 'next-intl/server'

const get = unstable_cache(
  () => withAzureDataAccess((dataAccess) => getAllProducts(dataAccess)),
  ['products'],
  { revalidate: 60, tags: ['products'] },
)

export default async function Home() {
  const products = await get()
  const translations = await getTranslations('home')
  
  return (
    <SessionProvider>
      <Header className='grid grid-cols-1 md:grid-cols-[90%_auto]'>
        <LangTrigger className='justify-self-end md:order-2' />
        <Title type="h1">
          <Logo></Logo>
          Naqab Bedouin Design
        </Title>
      </Header>
      <Main>
        {match(products)
          .with([], () => (
            <Small>
              {translations('empty')}
            </Small>
          ))
          .with(P.array(), (products) => (
            <>
              <ProductsShop products={products} />
            </>
          ))
          .with(P.when(isFailure), (failure) => <ErrorPage failure={failure} />)
          .exhaustive()}
      </Main>
    </SessionProvider>
  )
}
