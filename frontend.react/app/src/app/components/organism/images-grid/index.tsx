'use client'

import "./_images-grid.css"
import MainGrid from "@/app/components/grids/main"
import UploadAndCropImage, { Image } from "@/app/components/organism/upload-and-crop-image"
import ImageItem from "@/app/components/organism/images-grid/item"
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