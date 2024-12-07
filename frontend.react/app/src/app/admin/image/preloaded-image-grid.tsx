'use client'

import Button from '@/app/components/atoms/button'
import Image from '@/app/components/atoms/image'
import Small from '@/app/components/atoms/small'
import Grid from '@/app/components/atoms/grid'
import { imagesFetchAtom } from '@/lib/client/store'
import { ImagesFetch } from '@/lib/client/store/image'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { atom, useAtom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { match } from 'ts-pattern'
import { Annoyed, ImageUp, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/app/components/molecules/card'
import {
  deleteImageAction,
  ImageDeleteState,
} from '@/lib/client/store/image/delete'
import Spinner from '@/app/components/atoms/spinner'
import Title from '@/app/components/atoms/title'
import P from '@/app/components/atoms/p'
import { JSX } from 'react'

interface Props {
  urls: string[]
}

const imageDeleteStateAtom = atom<ImageDeleteState>({ step: 'idle' })

export default function PreloadedImagesGrid({ urls }: Props) {
  const data = urls.map((url) => atom({ url }))
  const intialImageFetchState: ImagesFetch = { step: 'fetched', data }
  useHydrateAtoms([[imagesFetchAtom, intialImageFetchState]])

  const imagesFetch = useAtomValue(imagesFetchAtom)
  const [imageDeleteState] = useAtom(imageDeleteStateAtom)
  const [, deleteImage] = useAtom(deleteImageAction)

  return (
    <>
      {match<ImagesFetch, JSX.Element>(imagesFetch)
        .with({ step: 'fetched', data: [] }, () => (
          <>
            <Title type="h4">
              <Annoyed height={48} width={48} />
              geen afbeeldingen gevonden
            </Title>
            <P>Wil je er een uploaden?</P>
            <Button>
              <ImageUp />
            </Button>
          </>
        ))
        .with({ step: 'fetched' }, ({}) => (
          <Grid>
            {urls.map((url, index) => (
              <Card key={index} className="card--borderless">
                <CardTitle></CardTitle>
                <CardContent>
                  <AspectRatio ratio={3 / 4}>
                    <Image
                      className="image--rounded"
                      key={index}
                      src={url}
                      alt={url} />
                  </AspectRatio>
                  <Small>{url}</Small>
                </CardContent>
                {match(imageDeleteState)
                  .with({ step: 'idle' }, () => (
                    <CardFooter className="card__footer--onhover">
                      <Button
                        onClick={async () => deleteImage(url, imageDeleteStateAtom)}
                      >
                        <Trash2 /> verwijderen
                      </Button>
                    </CardFooter>
                  ))
                  .with({ step: 'deleting', imageUrl: url }, () => (
                    <CardFooter>
                      <Spinner /> deleting...
                    </CardFooter>
                  ))
                  .with({ step: 'error', imageUrl: url }, ({ message }) => (
                    <CardFooter>{message}</CardFooter>
                  ))
                  .with({ step: 'done', imageUrl: url }, async () => {
                    return (
                      <CardFooter>
                        delete succesfull.. I will disapear in a second ;)
                      </CardFooter>
                    )
                  })
                  .otherwise(() => (
                    <CardFooter></CardFooter>
                  ))}
              </Card>
            ))}
          </Grid>
        ))
        .otherwise(() => (
          <></>
        ))}
    </>
  )
}
