import { withAzureDataAccess } from '@/lib/server'
import { isCreateProductResponse } from '@/lib/server/core/data-access'
import {
  ErrorInCosmosDbAccess,
  isErrorInCosmosDbAccess,
  isFailure,
  isProductValidationFailed,
} from '@/lib/server/core/failure'
import { createProduct, getAllProducts } from '@/lib/server/core/products'
import { Product } from '@/lib/server/core/types'
import { NextRequest, NextResponse } from 'next/server'
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

export const POST = (req: NextRequest): Promise<NextResponse> =>
  req
    .formData()
    .then((formData) =>
      withAzureDataAccess((dataAccess) => createProduct(formData, dataAccess)),
    )
    .then((either) =>
      match(either)
        .with(
          P.when(isCreateProductResponse),
          () => new NextResponse('done', { status: 200 }),
        )
        .with(P.when(isProductValidationFailed), (failure) =>
          NextResponse.json(failure, { status: 400 }),
        )
        .with(P.when(isErrorInCosmosDbAccess), (failure) =>
          NextResponse.json(failure, { status: 500 }),
        )
        .exhaustive(),
    )
