'use client'

import './_images-grid.css'
import { useState } from 'react'
import { match } from 'ts-pattern'
import OverlayContainer, { Overlay } from '@/app/components/atoms/overlay-container'
import ImageOrPlaceholder from '@/app/components/atoms/image-or-placeholder'
import Button from '@/app/components/atoms/button'
import Alert, { AlertDescription, AlertTitle } from '../../molecules/alert'
import { AlertCircle, Terminal } from 'lucide-react'

type State = 
| { step: 'idle' }
| { step: 'deleting', imageUrl: string }
| { step: 'error', message: string }

interface Props {
  imageUrl: string,
  onDeleting?: (imageUrl: string) => Promise<DeletingResult>
}

export type DeletingResult =
  | { deleted: true }
  | { deleted: false, message: string }

export default function ImageItem({imageUrl, onDeleting}: Props): JSX.Element {
  const [state, setState] = useState<State>({step: 'idle'})
  
  async function handleDeletion() {
    if (onDeleting) {
      await setState({step: 'deleting', imageUrl})

      const result = await onDeleting(imageUrl)

      await match(result)
        .with({deleted: true}, async () => await setState({step: 'idle'}))
        .with({deleted: false}, async ({message}) => await setState({step: 'error', message}))
        .exhaustive()
    }
  }

  return (
    <>
      {match(state)
        .with({step: 'idle'}, () => (
          <OverlayContainer className={"images-grid__item"}>
              <ImageOrPlaceholder src={imageUrl} alt={imageUrl} />
              <Overlay>
                {onDeleting &&
                  <Button onClick={handleDeletion}>Delete</Button>
                }
              </Overlay>
            </OverlayContainer>
        ))
        .with({step: 'deleting'}, ({imageUrl: name}) => (
          <Alert>
            <Terminal />
            <AlertTitle>Deleting {name}..</AlertTitle>
          </Alert>
        ))
        .with({step: 'error'}, ({message}) => (
          <Alert className='alert--destructive'>
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong: {message}
            </AlertDescription>
          </Alert>
          ))
        .exhaustive()
      }
    </>
  )
}