import { getImages } from "@/lib/services/images"
import { Provider } from "jotai"
import PreloadedImagesGrid from "./preloaded-image-grid"
import { toUrls } from "@/lib/client/store/image"
import Title from "@/app/components/atoms/title"
import { Separator } from "@/app/components/atoms/separator"

export default async function Page() {

  const imageNames = await getImages()
  const urls = toUrls(imageNames);

  return (
    <Provider>
      <Title type="h3">jouw afbeeldingen</Title>
      <Separator orientation="horizontal" />
      <PreloadedImagesGrid urls={urls} />
    </Provider>
  )
}