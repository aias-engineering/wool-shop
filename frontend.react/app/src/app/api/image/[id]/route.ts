import { NextRequest, NextResponse } from "next/server";
import * as azureImagesClient from '@/lib/server/boundary/azure/images-client'
import * as azureProductsClient from '@/lib/server/boundary/azure/products-client'
import { match, P } from "ts-pattern";
import { Unit, UploadImageResult } from "@/lib/server/core/types";
import { deleteImage, getImage } from "@/lib/server/core/service";
import { Failure, ImageReferencedByProducts } from "@/lib/server/core/failure";

interface Route {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Route) : Promise<NextResponse> {

  const result = await getImage(params.id, azureImagesClient.downloadImage)

  return match<ReadableStream | Failure, NextResponse>(result)
    .with(P.instanceOf(ReadableStream), (imageStream) => new NextResponse(imageStream))
    .with(P.instanceOf(Failure), ({reason}) => new NextResponse(reason, {status: 500}))
    .exhaustive()
}

export async function POST(req: NextRequest, {params}: Route) : Promise<NextResponse> {
  const blob = await req.blob()
  const blobStream = blob.stream()

  const result = await azureImagesClient.uploadImage(params.id, blobStream)

  return match<UploadImageResult, NextResponse>(result)
    .with({state: 'success'}, ({}) => new NextResponse("Done", {status: 200}))
    .with({state: 'failure'}, ({message}) => new NextResponse(message, {status: 400}))
    .exhaustive()
}

export async function DELETE(_: NextRequest, {params}: Route): Promise<NextResponse> {

  const deletionResult = await deleteImage(
    params.id, 
    azureProductsClient.readProductsWithImage, 
    azureImagesClient.deleteImageBlob)

  return match<Failure|Unit>(deletionResult)
    .with(P.instanceOf(ImageReferencedByProducts), (f) => NextResponse.json(f, { status: 400 }))
    .with(P.instanceOf(Unit), (f) => NextResponse.json(f, {status: 500}))
    .with(P.instanceOf(Unit), () => new NextResponse('done', {status: 200}))
    .exhaustive()
}
