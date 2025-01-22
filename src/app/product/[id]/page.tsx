import ErrorPage from '@/app/components/layout/error-page'
import Main from '@/app/components/main'
import { HasId, PromisesParams } from '@/lib/client/react'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getProduct } from '@/lib/server/core/products'
import ProductDetail from './product-detail'
import HeaderLayout from '@/app/components/layout/header'

export default async function Page({ params }: PromisesParams<HasId>) {
  const { id } = await params
  const eitherProductOrError = await withAzureDataAccess((dataAccess) =>
    getProduct(id, dataAccess),
  )

  if (isFailure(eitherProductOrError)) {
    return <ErrorPage failure={eitherProductOrError} />
  }

  const product = eitherProductOrError

  return (
    <>
      <HeaderLayout />
      <Main>
        <ProductDetail product={product} />
      </Main>
    </>
  )
}
