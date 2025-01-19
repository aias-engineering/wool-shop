'use client'

import './_images-grid.css'
import OverlayContainer, {
  Overlay,
} from '@/app/components/atoms/overlay-container'
import WsImage from '@/app/components/atoms/image'
import Button from '@/app/components/atoms/button'
import { atom, PrimitiveAtom, useAtomValue, useSetAtom } from 'jotai'
import { match } from 'ts-pattern'
import Alert, {
  AlertDescription,
  AlertTitle,
} from '@/app/components/molecules/alert'
import { AlertCircle } from 'lucide-react'
import Spinner from '@/app/components/atoms/spinner'
import Alertable, { AlertableAlert } from '@/app/components/atoms/alertable'
import {
  type Image,
  type ImageDelete,
  deleteImageAction,
} from '@/lib/client/store'
import { useMemo } from 'react'
import { AspectRatio } from '../../atoms/aspect-ratio'

interface Props {
  imageAtom: PrimitiveAtom<Image>
}

export default function ImageItem({ imageAtom }: Props): JSX.Element {
  const image = useAtomValue(imageAtom)
  const imageDeletionAtom = useMemo(
    () => atom<ImageDelete>({ imageAtom, step: 'idle' }),
    [imageAtom],
  )
  const imageDeletion = useAtomValue(imageDeletionAtom)
  const deleteImage = useSetAtom(deleteImageAction)

  return (
    <>
      {match<ImageDelete, JSX.Element>(imageDeletion)
        .with({ step: 'idle' }, () => {
          return (
            <OverlayContainer className={'images-grid__item'}>
              <AspectRatio ratio={1 / 1.5}>
                <WsImage
                  className={'image--rounded'}
                  src={image.url}
                  alt={image.url}
                />
              </AspectRatio>
              <Overlay>
                <Button
                  onClick={async () => await deleteImage(imageDeletionAtom)}
                >
                  Delete
                </Button>
              </Overlay>
            </OverlayContainer>
          )
        })
        .with({ step: 'deleting' }, () => (
          <Alertable>
            <AlertableAlert>
              <div>
                <Spinner />
              </div>
              <div>Deleting {image.url} ...</div>
            </AlertableAlert>
          </Alertable>
        ))
        .with({ step: 'error' }, ({ message }) => (
          <Alert className="alert--destructive">
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong: {message}</AlertDescription>
          </Alert>
        ))
        .otherwise(() => (
          <></>
        ))}
    </>
  )
}
