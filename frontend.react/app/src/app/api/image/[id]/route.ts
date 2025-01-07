import { NextRequest, NextResponse } from 'next/server'
import { match, P } from 'ts-pattern'
import { isUnit } from '@/lib/server/core/types'
import { deleteImage, getImage, saveImage } from '@/lib/server/core/images'
import {
  Failure,
  isFailure,
  isImageReferencedByProducts,
} from '@/lib/server/core/failure'
import { withAzureDataAccess } from '@/lib/server'

interface Route {
  params: Promise<{ id: string }>
}

export const GET = (_: NextRequest, route: Route): Promise<NextResponse> =>
  route.params
    .then(
      ({id}) => withAzureDataAccess(dataAccess => 
        getImage(id, dataAccess)
      )
    )
    .then((result) =>
    match<ReadableStream | Failure, NextResponse>(result)
      .with(
        P.instanceOf(ReadableStream),
        (imageStream) => new NextResponse(imageStream),
      )
      .with(
        P.when(isFailure),
        ({ reason }) => new NextResponse(reason, { status: 500 }),
      )
      .exhaustive(),
  )

export async function POST(
  req: NextRequest,
  { params }: Route,
): Promise<NextResponse> {
  const stream = await req.blob().then((blob) => blob.stream())

  return withAzureDataAccess(async (dataAccess) =>
    saveImage((await params).id, stream, dataAccess),
  ).then((result) =>
    match(result)
      .with(P.string, (uploadedImageName) => new NextResponse(uploadedImageName, { status: 200 }))
      .with(P.when(isFailure), (failure) =>
        NextResponse.json(failure, { status: 500 }),
      )
      .exhaustive(),
  )
}

export const DELETE = (
  _: NextRequest,
  { params }: Route,
): Promise<NextResponse> =>
  withAzureDataAccess(async (dataAccess) =>
    deleteImage((await params).id, dataAccess),
  ).then((result) =>
    match(result)
      .with(P.when(isImageReferencedByProducts), (f) =>
        NextResponse.json(f, { status: 400 }),
      )
      .with(P.when(isFailure), (f) => NextResponse.json(f, { status: 500 }))
      .with(P.when(isUnit), () => new NextResponse('done', { status: 200 }))
      .exhaustive(),
  )
