import { getImages } from "@/lib/services/images"
import { PreloadedImagesGrid } from "@/app/components/organism/images-grid"
import { Provider } from "jotai"

const toUrl = (blobname: string) => `/api/image/${blobname}`
const toUrls = (blobnames: string[]) => blobnames.map(name => toUrl(name))

export default async function Page() {

  const blobnames = await getImages()

  return (
  <Provider>
    <PreloadedImagesGrid imageUrls={toUrls(blobnames)} />
  </Provider>
  )
}