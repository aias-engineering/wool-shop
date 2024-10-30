'use client'

import "./_images-grid.css"
import MainGrid from "@/app/components/grids/main"
import ImageItem from "@/app/components/organism/images-grid/item"
import ImageUpload from "@/app/components/organism/images-grid/upload"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { Image, imagesAtom } from "./store"

interface Props {
  imageUrls: string[]
}

export function PreloadedImagesGrid({imageUrls}: Props) {
  const setImages = useSetAtom(imagesAtom)

  setImages(imageUrls.map(imageUrl => atom<Image>({url: imageUrl})))

  return <ImagesGrid />
}

export default function ImagesGrid() {
  const images = useAtomValue(imagesAtom)

  return (
    <>
      <MainGrid>
        <ImageUpload />
          {images.map((image, index) => {
            return (<ImageItem key={index} imageAtom={image} />)
          })}
      </MainGrid>
    </>
  )    
}