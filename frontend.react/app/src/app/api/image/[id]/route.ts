import { NextRequest, NextResponse } from "next/server";
import * as azureBlobStoreClient from '@/lib/server/boundary/azure/blob-store-client'
import * as azureCosmosClient from '@/lib/server/boundary/azure/cosmos-db-client'
import { match } from "ts-pattern";
import { DeleteImageResult, DonwloadImageResult, UploadImageResult } from "@/lib/server/core/types";
import { deleteImage } from "@/lib/server/core/service";

interface Route {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Route) : Promise<NextResponse> {
  const result = await azureBlobStoreClient.downloadImage(params.id)

  return match<DonwloadImageResult, NextResponse>(result)
    .with({state: 'success'}, ({imageStream}) => new NextResponse(imageStream))
    .with({state: 'not-found'}, ({}) => new NextResponse('Not found', {status: 404}))
    .with({state: 'failure'}, ({message}) => new NextResponse(message, {status: 400}))
    .exhaustive()
}

export async function POST(req: NextRequest, {params}: Route) : Promise<NextResponse> {
  const blob = await req.blob()
  const blobStream = blob.stream()

  const result = await azureBlobStoreClient.uploadImage(params.id, blobStream)

  return match<UploadImageResult, NextResponse>(result)
    .with({state: 'success'}, ({}) => new NextResponse("Done", {status: 200}))
    .with({state: 'failure'}, ({message}) => new NextResponse(message, {status: 400}))
    .exhaustive()
}

export async function DELETE(_: NextRequest, {params}: Route): Promise<NextResponse> {
  
  const readProductsWithImagePromise = azureCosmosClient.readProductsWithImage(params.id)
  const deleteImageBlobPromise = azureBlobStoreClient.deleteImageBlob(params.id)

  const result = await deleteImage(readProductsWithImagePromise, deleteImageBlobPromise)

  return match<DeleteImageResult, NextResponse>(result)
    .with({state: 'success'}, ({}) => new NextResponse("Done", {status: 200}))
    .with({state: 'referenced-by-products'}, ({products}) => {
      const result = {
        message: 'DELETE failed: image is referenced by products. See data:',
        products: products.map(p => p.name)
      }
      return NextResponse.json(result, { status: 400 })})
    .with({state: 'failure'}, ({message}) => new NextResponse(message, {status: 400}))
    .exhaustive()
}
