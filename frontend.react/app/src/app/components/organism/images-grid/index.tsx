'use client'

import "./_images-grid.css"
import Button from "@/app/components/atoms/button"
import ImageOrPlaceholder from "@/app/components/atoms/image-or-placeholder"
import MainGrid from "@/app/components/grids/main"
import UploadAndCropImage, { Image } from "@/app/components/organism/upload-and-crop-image"
import OverlayContainer, { Overlay } from "@/app/components/atoms/overlay-container"
import { useState } from "react"
import { match } from "ts-pattern"

interface Props {
  blobnames: string[]
}

type State =
  | { step: 'fetching' }
  | { step: 'fetched', blobnames: string[] }

export default function Images({blobnames}: Props) {
  const [fetchingState, setFetchingState] = useState<State>({step: 'fetched', blobnames})

  async function refetch(): Promise<void> {
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
            <ImageUpload onImageUploaded={refetch} />
            {blobnames.map((blob, index) => {
              return (<ImageItem key={index} name={blob} onDeleted={refetch}/>)
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
        <OverlayContainer  className={"images-grid__item"}>
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

type UploadingState =
  | { step: 'idle' }
  | { step: 'uploading', name: string }

interface UploadProps {
  onImageUploaded: () => Promise<void>
}

function ImageUpload({onImageUploaded}: UploadProps) {
  const [state, setState] = useState<UploadingState>({step: 'idle'})
  
  async function handleOnImagesCroped(image: Image) {
    await setState({ step: 'uploading', name: image.name })
    await fetch(`/api/image/${image.name}`, {
      body: image.data,
      method: 'POST'
    })
    await onImageUploaded()
    await setState({ step: 'idle' })
  }

  return (
    <>
      {match(state)
        .with({step:'idle'}, () => (
          <div className="images-grid__upload">
            <UploadAndCropImage onImageCroped={handleOnImagesCroped} />
          </div>
        ))
        .with({step: 'uploading'}, ({name}) => (
          <div>
            uploading {name}...
          </div>
        ))
        .exhaustive()}
    </>
  )
}