import Logo from '@/app/components/atoms/logo'
import Small from '@/app/components/atoms/small'
import Title from '@/app/components/atoms/title'
import Header from '@/app/components/header'
import ErrorPage from '@/app/components/layout/error-page'
import Main from '@/app/components/main'
import Products from '@/app/components/organism/products'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getAllProducts } from '@/lib/server/core/products'
import { match, P } from 'ts-pattern'

export default async function Home() {
  const products = await withAzureDataAccess((dataAccess) =>
    getAllProducts(dataAccess),
  )

  return (
    <>
      <Header>
        <Title type="h1" className="text-white">
          <Logo></Logo>
          Naqab Bedouin Design
        </Title>
      </Header>
      <Main>
        {match(products)
          .with([], () => (
            <Small>
              Oeps, we hebben onze producten nog niet gedefinieerd. Kom later
              nog eens bij ons terug.
            </Small>
          ))
          .with(P.array(), (products) => <Products products={products} />)
          .with(P.when(isFailure), (failure) => (
            <ErrorPage message={failure.reason} />
          ))
          .exhaustive()}
      </Main>
    </>
  )
}
