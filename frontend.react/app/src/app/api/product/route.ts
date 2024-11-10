import { readAllProducts } from '@/lib/server/boundary/azure/cosmos-db-client'
import { ReadProductsResult } from '@/lib/server/core/types'
import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'

export async function GET(): Promise<NextResponse> {

  const result = await readAllProducts()

  return match<ReadProductsResult, NextResponse>(result)
    .with({state: 'success'}, ({products}) => NextResponse.json(products))
    .with({state: 'failure'}, ({message}) => new NextResponse(message, {status: 500}))
    .exhaustive()
}