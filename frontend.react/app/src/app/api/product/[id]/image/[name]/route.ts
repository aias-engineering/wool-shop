import { downloadImage } from "@/lib/azure/blob-store-client";
import { fromReadabaleWebToBodyInit } from "@/lib/streams";

interface Route {
  params: { id: string, name: string  }
}

export async function GET(_: Request, { params }: Route) {

  const blobname = `${params.id}/${params.name}`

  console.log('getting image %s', blobname)

  const imageStream = await downloadImage(blobname)

    
  if (!imageStream)
    return new Response('Not Found', { status: 404 })

  const webStream = fromReadabaleWebToBodyInit(imageStream)

  const res = new Response(webStream, { headers: {'content-type': 'image/*'} })

  return res;
}