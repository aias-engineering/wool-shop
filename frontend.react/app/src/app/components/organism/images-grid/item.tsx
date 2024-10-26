'use client'

import './_images-grid.css'
import { useState } from 'react'
import { match } from 'ts-pattern'
import OverlayContainer, { Overlay } from '@/app/components/atoms/overlay-container'
import ImageOrPlaceholder from '@/app/components/atoms/image-or-placeholder'
import Button from '@/app/components/atoms/button'

type State = 
| { step: 'idle' }
| { step: 'deleting', name: string }
| { step: 'error', message: string }

interface Props {
  name: string,
  onDeleted: () => Promise<void>
}

export default function ImageItem({name, onDeleted}: Props): JSX.Element {
  const [state, setState] = useState<State>({step: 'idle'})
  const url = `/api/image/${name}`

  async function handleDeletion() {
    await setState({step: 'deleting', name: name})
    const response = await fetch(`/api/image/${name}`, {
      method: 'DELETE'
    })
    if (response.ok){
      await onDeleted()
      await setState({step: 'idle'})
    }
    else {
      await(setState({step: 'error', message: response.statusText }))  
    }
  }

  return (
    <>
      {match(state)
        .with({step: 'idle'}, () => (
          <OverlayContainer className={"images-grid__item"}>
            <ImageOrPlaceholder src={url} alt={name} />
            <Overlay>
              <Button onClick={handleDeletion}>Delete</Button>
            </Overlay>
          </OverlayContainer>
        ))
        .with({step: 'deleting'}, ({name}) => (
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