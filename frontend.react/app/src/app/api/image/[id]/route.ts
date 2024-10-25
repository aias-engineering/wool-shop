import { downloadImage } from "@/lib/azure/blob-store-client";
import { deleteImage, postImage } from "@/lib/services/images";
import { NextRequest, NextResponse } from "next/server";
import { mdnReadableStream_From_NodeReadableStream, nodeReadable_From_MdnReadableStream } from "@/lib/streams";

interface Route {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Route) : Promise<NextResponse> {
  console.log('receiving %o', params)

  const imageStream = await downloadImage(params.id)

  if (!imageStream)
    return new NextResponse('Not Found', { status: 404 })

  const mdnStream = mdnReadableStream_From_NodeReadableStream(imageStream)

  const res = new NextResponse(mdnStream, { headers: {'content-type': 'image/*'} })

  return res;
}

export async function POST(req: NextRequest, {params}: Route) {
  const blob = await req.blob()
  const blobStream = blob.stream()
  const readable = nodeReadable_From_MdnReadableStream(blobStream)
  await postImage(params.id, readable)
  return new NextResponse('done')
}

export async function DELETE(_: NextRequest, {params}: Route): Promise<NextResponse> {
  console.log('deleting image %s.. ', params.id)
  await deleteImage(params.id)
  return new NextResponse('done')
}
