'use client'

import "./_images-grid.css"
import MainGrid from "@/app/components/grids/main"
import UploadAndCropImage, { Image } from "@/app/components/organism/upload-and-crop-image"
import ImageItem, { DeletingResult } from "@/app/components/organism/images-grid/item"
import { useState } from "react"
import { match } from "ts-pattern"

interface Props {
  blobnames: string[]
}

type State =
  | { step: 'fetching' }
  | { step: 'fetched', urls: string[] }

export default function Images({blobnames}: Props) {
  const toUrl = (blobname: string) => `/api/image/${blobname}`
  const toUrls = (blobnames: string[]) => blobnames.map(name => toUrl(name))

  const [fetchingState, setFetchingState] = useState<State>({step: 'fetched', urls: toUrls(blobnames)})
  
  async function deleteImage(imageUrl: string): Promise<DeletingResult> {
    const response = await fetch(imageUrl, {
      method: 'DELETE'
    })
    if (response.ok){
      await refetch()
      return { deleted: true }
    }
    else {
      return {deleted: false, message: response.statusText}
    }
  }

  async function refetch(): Promise<void> {
    await setFetchingState({ step: 'fetching' })
    const response = await fetch('/api/image')
    const resultingNames: string[] = await response.json()
    await setFetchingState({step: 'fetched', urls: toUrls(resultingNames) })
  }

  return (
    <>
      {match(fetchingState)
        .with({step: 'fetching'}, ({}) => 
          (<>
            fetching...
          </>
        ))
        .with({step: 'fetched'}, ({urls}) => (
          <MainGrid>
            <ImageUpload onImageUploaded={refetch} />
            {urls.map((url, index) => {
              return (<ImageItem key={index} imageUrl={url} onDeleting={deleteImage}/>)
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