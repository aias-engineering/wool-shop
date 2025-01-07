'use client'

import Button from '@/app/components/atoms/button'
import Image from 'next/image'
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
import Paragraph from '@/app/components/atoms/paragraph'
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
  const [, _] = useAtom(deleteImageAction)

  return (
    <>
      {match<ImagesFetch, JSX.Element>(imagesFetch)
        .with({ step: 'fetched', data: [] }, () => (
          <>
            <Title type="h4">
              <Annoyed height={48} width={48} />
              geen afbeeldingen gevonden
            </Title>
            <Paragraph>Wil je er een uploaden?</Paragraph>
            <Button>
              <ImageUp />
            </Button>
          </>
        ))
        .with({ step: 'fetched' }, ({}) => (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {urls.map((url, index) => (
              <Card key={index} className="card--borderless">
                <CardTitle></CardTitle>
                <CardContent>
                  <Image  src={url} alt={url}
                          sizes='(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                          width={200}
                          height={300}
                          className='w-full' />
                  <Small>{url}</Small>
                </CardContent>
                {match(imageDeleteState)
                  .with({ step: 'idle' }, () => (
                    <CardFooter className="card__footer--onhover">
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
