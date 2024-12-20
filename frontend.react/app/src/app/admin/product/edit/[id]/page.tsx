import Grid from '@/app/components/atoms/grid'
import Image from '@/app/components/atoms/image'
import ErrorPage from '@/app/components/layout/error-page'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getProduct } from '@/lib/server/core/products'
import { match, P } from 'ts-pattern'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const product = await withAzureDataAccess(async (dataAccess) => {
    const p = await params
    return getProduct(p.id, dataAccess)
  })

  return (
    <>
      {match(product)
        .with(P.when(isFailure), (failure) => (
          <ErrorPage message={failure.code} />
        ))
        .with(P.select(), (product) => (
          <>
            <form>
              <Grid className="grid-cols-2">
                <Image src={product.image} alt={product.image} />
              </Grid>
            </form>
          </>
        ))
        .exhaustive()}
    </>
  )
}
