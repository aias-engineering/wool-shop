'use client'

import './_images-grid.css'
import OverlayContainer, { Overlay } from '@/app/components/atoms/overlay-container'
import ImageOrPlaceholder from '@/app/components/atoms/image-or-placeholder'
import Button from '@/app/components/atoms/button'
import { useAtomValue, useSetAtom } from 'jotai'
import { PrimitiveAtom } from 'jotai'
import { deleteImageAction, Image } from './store'
import { match } from 'ts-pattern'
import Alert, { AlertDescription, AlertTitle } from '../../molecules/alert'
import { AlertCircle, Terminal } from 'lucide-react'
import Spinner from '../../atoms/spinner'
import Alertable, { AlertableAlert } from '../../atoms/alertable'

interface Props {
  imageAtom: PrimitiveAtom<Image>,
}

export default function ImageItem({imageAtom}: Props): JSX.Element {
  const image = useAtomValue(imageAtom)
  const deleteImage = useSetAtom(deleteImageAction)
  
  return (
    <>
      {match(image.state)
        .with({ step: 'deleting' }, () => (
          <Alertable>
            <AlertableAlert>
              <div><Spinner /></div>
              <div>Deleting {image.url} ...</div>
            </AlertableAlert>
          </Alertable>
        ))
        .with({ step: 'delete-failed' }, ({message}) => (
          <Alert className='alert--destructive'>
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong: {message}
            </AlertDescription>
          </Alert>
        ))
        .otherwise(() => (
          <OverlayContainer className={"images-grid__item"}>
            <ImageOrPlaceholder src={image.url} alt={image.url} />
            <Overlay>
              <Button onClick={async() => deleteImage(imageAtom)}>Delete</Button>
            </Overlay>
          </OverlayContainer>
        ))}
    </>
  )
}