import { getImages } from "@/lib/services/images"
import { Provider } from "jotai"
import PreloadedImagesGrid from "./preloaded-image-grid"
import { toUrl, toUrls } from "@/lib/client/store/image"
import MainGrid from "@/app/components/grids/main"
import Image from "@/app/components/atoms/image"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import Title from "@/app/components/atoms/title"
import Small from "@/app/components/atoms/small"
import Space from "@/app/components/atoms/space"
import Button from "@/app/components/atoms/button"

export default async function Page() {

  const imageNames = await getImages()
  const urls = toUrls(imageNames);

  return (
    <Provider>
      <Title type="h3">jouw afbeeldingen</Title>
      <PreloadedImagesGrid urls={urls} />
    </Provider>
  )
}