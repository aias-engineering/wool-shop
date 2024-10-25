import { getImages } from "@/lib/services/images"
import Images from "./images"

export default async function Page() {

  const blobnames = await getImages()
  return (
  <>
    <Images blobnames={blobnames} />
  </>
  )
}