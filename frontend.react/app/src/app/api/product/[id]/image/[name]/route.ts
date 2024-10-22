import { downloadImage } from "@/lib/azure/blob-store-client";
import { fromReadabaleWebToBodyInit } from "@/lib/streams";
import { NextRequest, NextResponse } from "next/server";

interface Route {
  params: { id: string, name: string  }
}

export async function GET(_: NextRequest, { params }: Route) {

  const blobname = `${params.id}/${params.name}`

  console.log('getting image %s', blobname)

  const imageStream = await downloadImage(blobname)

    
  if (!imageStream)
    return new NextResponse('Not Found', { status: 404 })

  const webStream = fromReadabaleWebToBodyInit(imageStream)

  const res = new NextResponse(webStream, { headers: {'content-type': 'image/*'} })

  return res;
}