import { withAzureDataAccess } from '@/lib/server'
import {
  ErrorInCosmosDbAccess,
  ProductWithIdNotFound,
} from '@/lib/server/core/failure'
import { deleteProduct, getProduct } from '@/lib/server/core/products'
import { Unit } from '@/lib/server/core/types'
import { NextResponse } from 'next/server'
import { match, P } from 'ts-pattern'

interface Route {
  params: Promise<{ id: string }>
}

export const GET = async (_: Request, { params }: Route) =>
  withAzureDataAccess(async (dataAccess) => getProduct((await params).id, dataAccess)).then(
    (either) =>
      match(either)
        .with(P.instanceOf(ProductWithIdNotFound), (failure) =>
          NextResponse.json(failure, { status: 404 }),
        )
        .with(P.instanceOf(ErrorInCosmosDbAccess), (failure) =>
          NextResponse.json(failure, { status: 500 }),
        )
        .with(P.select(), (product) =>
          NextResponse.json(product, { status: 200 }),
        )
        .exhaustive(),
  )

export const DELETE = async(_: Request, { params }: Route) => 
  withAzureDataAccess(
    dataAccess => 
      params
        .then(
          ({ id }) => deleteProduct(id, dataAccess)
        )
        .then(
          either => 
            match(either)
              .with(P.instanceOf(ErrorInCosmosDbAccess), (failure) => 
                NextResponse.json(failure, { status: 500 })
              )
              .with(P.instanceOf(Unit), () => 
                new NextResponse('done', { status: 200 })
              )
            .exhaustive()))