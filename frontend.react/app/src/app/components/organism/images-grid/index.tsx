'use client'

import "./_images-grid.css"
import MainGrid from "@/app/components/grids/main"
import ImageItem from "@/app/components/organism/images-grid/item"
import ImageUpload from "@/app/components/organism/images-grid/upload"
import { imagesFetchAtom } from "@/lib/client/store"
import { useAtomValue } from "jotai"
import { match } from "ts-pattern"

export default function ImagesGrid() {
  const imagesFetch = useAtomValue(imagesFetchAtom)

  return (
    <>
      {match(imagesFetch)
        .with({step: 'fetched'}, ({data}) => (
          <MainGrid>
            <ImageUpload />
              {data.map((image, index) => {
                return (<ImageItem key={index} imageAtom={image} />)
              })}
          </MainGrid>
        ))
        .otherwise(() => <></>)}
    </>
  )    
}