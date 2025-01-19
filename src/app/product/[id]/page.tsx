import Logo from '@/app/components/atoms/logo'
import Title from '@/app/components/atoms/title'
import Header from '@/app/components/header'
import ErrorPage from '@/app/components/layout/error-page'
import Main from '@/app/components/main'
import { HasId, PromisesParams } from '@/lib/client/react'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getProduct, isProduct } from '@/lib/server/core/products'
import { match, P } from 'ts-pattern'
import ProductDetail from './product-detail'

export default async function Page({ params }: PromisesParams<HasId>) {
  const { id } = await params
  const eitherProductOrError = await withAzureDataAccess((dataAccess) =>
    getProduct(id, dataAccess),
  )

  return (
    <>
      <Header>
        <Title type="h1">
          <Logo></Logo>
          Naqab Bedouin Design
        </Title>
      </Header>
      <Main>
        {match(eitherProductOrError)
          .with(P.when(isProduct), (product) => (
            <>
              <ProductDetail product={product} />
            </>
          ))
          .with(P.when(isFailure), (failure) => <ErrorPage failure={failure} />)
          .exhaustive()}
      </Main>
    </>
  )
}
