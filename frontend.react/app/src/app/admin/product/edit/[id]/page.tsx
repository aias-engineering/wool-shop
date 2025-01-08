import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getProduct, isProduct } from '@/lib/server/core/products'
import { EditProduct } from './edit-product'
import AdminHeaderLayout from '@/app/components/layout/admin/header'
import { AdminMain } from '@/app/components/layout/admin'
import { match, P } from 'ts-pattern'
import AdminErrorPage from '@/app/components/layout/admin/error-page'
import { HasId, PromisesParams } from '@/lib/client/react'

export default async function Page({ params }: PromisesParams<HasId>) {
  const eitherProductOrFailure = await params.then(({ id }) =>
    withAzureDataAccess((dataAccess) => getProduct(id, dataAccess)),
  )

  return (
    <>
      <AdminHeaderLayout></AdminHeaderLayout>
      <AdminMain>
        {match(eitherProductOrFailure)
          .with(P.when(isProduct), (product) => (
            <EditProduct product={product} />
          ))
          .with(P.when(isFailure), (failure) => (
            <AdminErrorPage failure={failure} />
          ))
          .exhaustive()}
      </AdminMain>
    </>
  )
}
