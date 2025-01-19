import { HasId, PromisesParams } from '@/lib/client/react'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure, isProductWithIdNotFound } from '@/lib/server/core/failure'
import { deleteProduct, getProduct } from '@/lib/server/core/products'
import { isUnit } from '@/lib/server/core/types'
import { NextResponse } from 'next/server'
import { match, P } from 'ts-pattern'

export const GET = async (_: Request, { params }: PromisesParams<HasId>) =>
  withAzureDataAccess(async (dataAccess) =>
    getProduct((await params).id, dataAccess),
  ).then((either) =>
    match(either)
      .with(P.when(isProductWithIdNotFound), (failure) =>
        NextResponse.json(failure, { status: 404 }),
      )
      .with(P.when(isFailure), (failure) =>
        NextResponse.json(failure, { status: 500 }),
      )
      .with(P.select(), (product) =>
        NextResponse.json(product, { status: 200 }),
      )
      .exhaustive(),
  )

export const DELETE = async (_: Request, { params }: PromisesParams<HasId>) =>
  withAzureDataAccess((dataAccess) =>
    params
      .then(({ id }) => deleteProduct(id, dataAccess))
      .then((either) =>
        match(either)
          .with(P.when(isFailure), (failure) =>
            NextResponse.json(failure, { status: 500 }),
          )
          .with(P.when(isUnit), () => new NextResponse('done', { status: 200 }))
          .exhaustive(),
      ),
  )
