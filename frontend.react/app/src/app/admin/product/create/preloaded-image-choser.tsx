'use client'

import ImageChoser from "@/app/components/organism/image-choser"
import { imagesFetchAtom } from "@/lib/client/store"
import { toUrls } from "@/lib/client/store/image"
import { atom, useSetAtom } from "jotai"
import { useMemo } from "react"

interface Props {
  imagenames: string[]
}

export default function PreloadedImagesGrid({imagenames}: Props) {
  const setImagesFetch = useSetAtom(imagesFetchAtom)
  useMemo(() => {
    const data = toUrls(imagenames).map(url => atom({url}))
    setImagesFetch({step: 'fetched', data })
  }, [imagenames, setImagesFetch])

  return (
    <ImageChoser />
  )
}