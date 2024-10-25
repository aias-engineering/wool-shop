'use client'

import Button from "@/app/components/button"
import ImageOrPlaceholder from "@/app/components/image"
import MainGrid from "@/app/components/main-grid"
import UploadAndCropImage, { Image } from "@/app/components/organism/upload-and-crop-image"
import OverlayContainer, { Overlay } from "@/app/components/overlay-container"
import { useState } from "react"
import { match } from "ts-pattern"

interface Props {
  blobnames: string[]
}

type State =
  | { step: 'fetching' }
  | { step: 'fetched', blobnames: string[] }

type UploadingState =
  | { step: 'idle' }
  | { step: 'uploading', name: string }

export default function Images({blobnames}: Props) {
  const [fetchingState, setFetchingState] = useState<State>({step: 'fetched', blobnames})
  const [uploadingState, setUploadingState] = useState<UploadingState>({step: 'idle'})

  async function handleOnImagesCroped(image: Image): Promise<void> {
    await setUploadingState({ step: 'uploading', name: image.name })
    await fetch(`/api/image/${image.name}`, {
      body: image.data,
      method: 'POST'
    })
    await setFetchingState({ step: 'fetching' })
    const response = await fetch('/api/image')
    await setFetchingState({step: 'fetched', blobnames: await response.json() })
    await setUploadingState({ step: 'idle' })
  }

  async function handleDeleted(): Promise<void> {
    await setFetchingState({ step: 'fetching' })
    const response = await fetch('/api/image')
    await setFetchingState({step: 'fetched', blobnames: await response.json() })
  }

  return (
    <>
      {match(fetchingState)
        .with({step: 'fetching'}, ({}) => 
          (<>
            fetching...
          </>
        ))
        .with({step: 'fetched'}, ({blobnames}) => (
          <MainGrid>
            {match(uploadingState)
              .with({step: 'idle'}, () => (
                <div>
                  <h3>Upload an Image</h3>
                  <UploadAndCropImage onImageCroped={handleOnImagesCroped} />
                </div>
              ))
              .with({step: 'uploading'}, ({name}) => (
                <div>
                  uploading {name}...
                </div>
              ))
              .exhaustive()
            }
            {blobnames.map((blob, index) => {
              return (<ImageItem key={index} name={blob} onDeleted={handleDeleted}/>)
            })}
          </MainGrid>
        ))
      .exhaustive()}
    </>
  )    
}

type DeletingState = 
| { step: 'idle' }
| { step: 'deleteing', name: string }
| { step: 'error', message: string }

interface ItemProps {
  name: string,
  onDeleting?: () => Promise<void>,
  onDeleted: () => Promise<void>
}

function ImageItem({name, onDeleted}: ItemProps) {
  const [state, setState] = useState<DeletingState>({step: 'idle'})
  const url = `/api/image/${name}`

  async function handleDeletion() {
    await setState({step: 'deleteing', name: name})
    try {
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
    } catch (error) {
      await(setState({step: 'error', message: error as string}))
    }
  }

  return (
   <>
    {match(state)
      .with({step: 'idle'}, () => (
        <OverlayContainer>
          <ImageOrPlaceholder src={url} alt={name} />
          <Overlay>
            <Button onClick={handleDeletion}>Delete</Button>
          </Overlay>
        </OverlayContainer>
      ))
      .with({step: 'deleteing'}, ({name}) => (
        <><div>Deleting {name}</div></>
      ))
      .with({step: 'error'}, ({message}) => (
        <div>
          Something went wrong:
          {message}
        </div>
      ))
      .exhaustive()}
    </>
  )
}