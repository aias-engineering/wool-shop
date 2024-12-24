import { withAzureDataAccess } from '@/lib/server'
import { ErrorInCosmosDbAccess, isFailure } from '@/lib/server/core/failure'
import { getAllProducts } from '@/lib/server/core/products'
import { Product } from '@/lib/server/core/types'
import { NextResponse } from 'next/server'
import { match, P } from 'ts-pattern'

export async function GET(): Promise<NextResponse> {
  const result = await withAzureDataAccess((dataAccess) =>
    getAllProducts(dataAccess),
  )

  return match<ErrorInCosmosDbAccess | Product[], NextResponse>(result)
    .with(P.array(), (products) => NextResponse.json(products))
    .with(
      P.when(isFailure),
      ({ reason }) => new NextResponse(reason, { status: 500 }),
    )
    .exhaustive()
}
