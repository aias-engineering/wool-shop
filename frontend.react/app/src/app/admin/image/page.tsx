import { getImages } from "@/lib/services/images"
import { Provider } from "jotai"
import PreloadedImagesGrid from "./preloaded-image-grid"

export default async function Page() {

  const blobnames = await getImages()

  return (
  <Provider>
    <PreloadedImagesGrid imagenames={blobnames} />
  </Provider>
  )
}