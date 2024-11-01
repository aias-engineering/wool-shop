'use client'

import Button from "@/app/components/atoms/button"
import Image from "@/app/components/atoms/image"
import Small from "@/app/components/atoms/small"
import Space from "@/app/components/atoms/space"
import Title from "@/app/components/atoms/title"
import MainGrid from "@/app/components/grids/main"
import ImageItem from "@/app/components/organism/images-grid/item"
import ImageUpload from "@/app/components/organism/images-grid/upload"
import { imagesFetchAtom } from "@/lib/client/store"
import { ImagesFetch } from "@/lib/client/store/image"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { atom, useAtomValue } from "jotai"
import { useHydrateAtoms } from "jotai/utils"
import { match } from "ts-pattern"

interface Props {
  urls: string[]
}

export default function PreloadedImagesGrid({urls}: Props) {
  const data = urls.map(url => atom({url}))
  const intialImageFetchState: ImagesFetch = {step: 'fetched', data }
  useHydrateAtoms([[imagesFetchAtom, intialImageFetchState]])
  const imagesFetch = useAtomValue(imagesFetchAtom)

  return (
    <>
      {match(imagesFetch)
        .with({step: 'fetched'}, ({data}) => (
          <>
            <div>
              <Title type="h3">Old</Title>
              <MainGrid>
                <ImageUpload />
                {data.map((image, index) => (
                  <ImageItem key={index} imageAtom={image} />
                ))}
              </MainGrid>
            </div>
            <div>
              <MainGrid>
                {urls.map((url, index) => {
                  return (
                    <div key={index}>
                      <AspectRatio ratio={3 / 4}>
                        <Image className="image--rounded" key={index} src={url} alt={url} />
                      </AspectRatio>
                      <Space className="space--top-1">
                        <Small>{url}</Small>
                      </Space>
                      <Space className="space--top-1">
                        <Button onClick={async () => {}}>verwijderen</Button>
                      </Space>
                    </div>
                  )
                })}
              </MainGrid>
            </div>
          </>
      ))
      .otherwise(() => <></>)}
  </>
  )
}