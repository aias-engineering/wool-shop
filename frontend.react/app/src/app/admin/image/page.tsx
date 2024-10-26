import { getImages } from "@/lib/services/images"
import Images from "@/app/components/organism/images-grid"

export default async function Page() {

  const blobnames = await getImages()
  return (
  <>
    <Images blobnames={blobnames} />
  </>
  )
}