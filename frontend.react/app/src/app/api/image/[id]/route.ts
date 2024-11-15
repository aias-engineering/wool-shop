import { NextRequest, NextResponse } from "next/server";
import { match, P } from "ts-pattern";
import { Unit } from "@/lib/server/core/types";
import { deleteImage, getImage, saveImage } from "@/lib/server/core/images";
import { ErrorInBlobStorageAccess, Failure, ImageReferencedByProducts } from "@/lib/server/core/failure";
import { withAzureDataAccess } from "@/lib/server/core/data-access";

interface Route {
  params: { id: string }
}

export const GET = (_: NextRequest, { params }: Route) : Promise<NextResponse> => 
  withAzureDataAccess((dataAccess => getImage(params.id, dataAccess)))
    .then((result) => 
      match<ReadableStream | Failure, NextResponse>(result)
        .with(P.instanceOf(ReadableStream), (imageStream) => new NextResponse(imageStream))
        .with(P.instanceOf(Failure), ({ reason }) => new NextResponse(reason, { status: 500 }))
        .exhaustive())

export async function POST(req: NextRequest, {params}: Route) : Promise<NextResponse> {
  const stream = await req.blob()
    .then(
      blob => blob.stream())

  return withAzureDataAccess(dataAccess => saveImage(params.id, stream, dataAccess))
      .then(
        result => 
          match(result)
            .with(P.instanceOf(Unit), () => new NextResponse('done', { status: 200 }))
            .with(
              P.instanceOf(ErrorInBlobStorageAccess), 
              (failure) => NextResponse.json(failure, {status: 500}))
            .exhaustive())
}

export const DELETE = (_: NextRequest, {params}: Route): Promise<NextResponse> =>
  withAzureDataAccess((dataAccess => deleteImage(params.id, dataAccess)))
    .then(
      (result) => 
        match(result)
          .with(P.instanceOf(ImageReferencedByProducts), (f) => NextResponse.json(f, { status: 400 }))
          .with(P.instanceOf(Failure), (f) => NextResponse.json(f, {status: 500}))
          .with(P.instanceOf(Unit), () => new NextResponse('done', {status: 200}))
          .exhaustive()
    )
