import Grid from '@/app/components/atoms/grid'
import Image from '@/app/components/atoms/image'
import ErrorPage from '@/app/components/layout/error-page'
import { withAzureDataAccess } from '@/lib/server/core/data-access'
import {
  ErrorInCosmosDbAccess,
  ProductWithIdNotFound,
} from '@/lib/server/core/failure'
import { getProduct } from '@/lib/server/core/products'
import { match, P } from 'ts-pattern'

export default async function Page({ params }: { params: { id: string } }) {
  const product = await withAzureDataAccess((dataAccess) =>
    getProduct(params.id, dataAccess),
  )

  return (
    <>
      {match(product)
        .with(P.instanceOf(ErrorInCosmosDbAccess), (failure) => (
          <ErrorPage message={failure.code} />
        ))
        .with(P.instanceOf(ProductWithIdNotFound), (failure) => (
          <ErrorPage message={failure.code} />
        ))
        .with(P.select(), (product) => (
          <>
            <form>
              <Grid className="grid--2-cols">
                <Image src={product.image} alt={product.image} />
              </Grid>
            </form>
          </>
        ))
        .exhaustive()}
    </>
  )
}
