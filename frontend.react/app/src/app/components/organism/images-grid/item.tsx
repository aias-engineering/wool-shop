'use client'

import './_images-grid.css'
import { useState } from 'react'
import { match } from 'ts-pattern'
import OverlayContainer, { Overlay } from '@/app/components/atoms/overlay-container'
import ImageOrPlaceholder from '@/app/components/atoms/image-or-placeholder'
import Button from '@/app/components/atoms/button'

type State = 
| { step: 'idle' }
| { step: 'deleting', imageUrl: string }
| { step: 'error', message: string }

interface Props {
  imageUrl: string,
  onDeleting: (imageUrl: string) => Promise<DeletingResult>
}

export type DeletingResult =
  | { deleted: true }
  | { deleted: false, message: string }

export default function ImageItem({imageUrl, onDeleting}: Props): JSX.Element {
  const [state, setState] = useState<State>({step: 'idle'})
  
  async function handleDeletion() {
    await setState({step: 'deleting', imageUrl})

    const result = await onDeleting(imageUrl)

    await match(result)
      .with({deleted: true}, async () => await setState({step: 'idle'}))
      .with({deleted: false}, async ({message}) => await setState({step: 'error', message}))
      .exhaustive()
  }

  return (
    <>
      {match(state)
        .with({step: 'idle'}, () => (
          <OverlayContainer className={"images-grid__item"}>
            <ImageOrPlaceholder src={imageUrl} alt={imageUrl} />
            <Overlay>
              <Button onClick={handleDeletion}>Delete</Button>
            </Overlay>
          </OverlayContainer>
        ))
        .with({step: 'deleting'}, ({imageUrl: name}) => (
          <div>Deleting {name}</div>
        ))
        .with({step: 'error'}, ({message}) => (
          <div>
            Something went wrong:
            {message}
          </div>
          ))
        .exhaustive()
      }
    </>
  )
}