'use client'

import Button from "@/app/components/atoms/button"
import Image from "@/app/components/atoms/image"
import { Separator } from "@/app/components/atoms/separator"
import Small from "@/app/components/atoms/small"
import Title from "@/app/components/atoms/title"
import Grid from "@/app/components/atoms/grid"
import ImageItem from "@/app/components/organism/images-grid/item"
import ImageUpload from "@/app/components/organism/images-grid/upload"
import { imagesFetchAtom } from "@/lib/client/store"
import { ImagesFetch } from "@/lib/client/store/image"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { atom, useAtomValue } from "jotai"
import { useHydrateAtoms } from "jotai/utils"
import { match } from "ts-pattern"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/organism/dialog'
import { ImageUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardTitle } from "@/app/components/molecules/card"

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
              <Grid>
                <ImageUpload />
                {data.map((image, index) => (
                  <ImageItem key={index} imageAtom={image} />
                ))}
              </Grid>
            </div>
            <div>
              <Title type="h3">New</Title>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <ImageUp /> afbeelding uploaden
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Hello my dear world.
                    </DialogTitle>
                    <DialogDescription>
                      Blub
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    Some text
                  </div>
                </DialogContent>
              </Dialog>
              <Separator orientation="horizontal" />
              <Grid>
                {urls.map((url, index) => {
                  return (
                    <Card key={index}>
                      <CardTitle>

                      </CardTitle>
                      <CardContent>
                        <AspectRatio ratio={3 / 4}>
                          <Image className="image--rounded" key={index} src={url} alt={url} />
                        </AspectRatio>
                       <Small>{url}</Small>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={async () => {}}>verwijderen</Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </Grid>
            </div>
          </>
      ))
      .otherwise(() => <></>)}
  </>
  )
}