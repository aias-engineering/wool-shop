'use client'

import ImagesGrid from "@/app/components/organism/images-grid"
import { imagesFetchAtom } from "@/lib/client/store"
import { ImagesFetch, toUrls } from "@/lib/client/store/image"
import { atom } from "jotai"
import { useHydrateAtoms } from "jotai/utils"

interface Props {
  imagenames: string[]
}

export default function PreloadedImagesGrid({imagenames}: Props) {
  const data = toUrls(imagenames).map(url => atom({url}))
  const intialImageFetchState: ImagesFetch = {step: 'fetched', data }

  useHydrateAtoms([[imagesFetchAtom, intialImageFetchState]])

  return (
    <ImagesGrid />
  )
}