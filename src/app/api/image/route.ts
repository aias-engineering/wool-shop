import { withAzureDataAccess } from '@/lib/server'
import { ErrorInBlobStorageAccess } from '@/lib/server/core/failure'
import { isFailure } from '@/lib/server/core/failure'
import { getImages } from '@/lib/server/core/images'
import { NextResponse } from 'next/server'
import { match, P } from 'ts-pattern'

export async function GET(): Promise<NextResponse> {
  const imagesResult = await withAzureDataAccess((dataAccess) =>
    getImages(dataAccess),
  )

  return match<ErrorInBlobStorageAccess | string[], NextResponse>(imagesResult)
    .with(P.array(), (imagenames) => NextResponse.json(imagenames))
    .with(
      P.when(isFailure),
      (error) => new NextResponse(error.reason, { status: 500 }),
    )
    .exhaustive()
}
