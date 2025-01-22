import Small from '@/app/components/atoms/small'
import ErrorPage from '@/app/components/layout/error-page'
import Main from '@/app/components/main'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getAllProducts } from '@/lib/server/core/products'
import { match, P } from 'ts-pattern'
import ProductsShop from './products-shop'
import { unstable_cache } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import HeaderLayout from './components/layout/header'

const get = unstable_cache(
  () => withAzureDataAccess((dataAccess) => getAllProducts(dataAccess)),
  ['products'],
  { revalidate: 60, tags: ['products'] },
)

export default async function Home() {
  const products = await get()
  const translations = await getTranslations('home')

  return (
    <>
      <HeaderLayout />
      <Main>
        {match(products)
          .with([], () => <Small>{translations('empty')}</Small>)
          .with(P.array(), (products) => (
            <>
              <ProductsShop products={products} />
            </>
          ))
          .with(P.when(isFailure), (failure) => <ErrorPage failure={failure} />)
          .exhaustive()}
      </Main>
    </>
  )
}
