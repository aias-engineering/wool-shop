import ErrorPage from '@/app/components/layout/error-page'
import Main from '@/app/components/main'
import { HasId, PromisesParams } from '@/lib/client/react'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getProduct, isProduct } from '@/lib/server/core/products'
import { match, P } from 'ts-pattern'
import ProductDetail from './product-detail'
import HeaderLayout from '@/app/components/layout/header'

export default async function Page({ params }: PromisesParams<HasId>) {
  const { id } = await params
  const eitherProductOrError = await withAzureDataAccess((dataAccess) =>
    getProduct(id, dataAccess),
  )

  return (
    <>
      <HeaderLayout />
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
