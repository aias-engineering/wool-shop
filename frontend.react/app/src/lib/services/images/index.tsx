import { getImagesFlat, storeImage } from "@/lib/azure/blob-store-client";
import { revalidateTag, unstable_cache } from "next/cache";
import stream from "stream";

export const getImages = unstable_cache(
  async () => await getImagesFlat(),
  ['images-index'],
  {revalidate: 3600, tags: ['images-index'] }
)

export async function postImage(name: string, stream: stream.Readable) {
  await storeImage(name, stream)
  revalidateTag('images-index')
}