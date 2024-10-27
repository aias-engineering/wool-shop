'use client'

import "./_images-grid.css"
import MainGrid from "@/app/components/grids/main"
import ImageItem, { DeletingResult } from "@/app/components/organism/images-grid/item"
import ImageUpload, { ImageUploadingResult } from "@/app/components/organism/images-grid/upload"
import { Image } from '@/app/components/organism/upload-and-crop-image'
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
  
  async function uploadImage(image: Image): Promise<ImageUploadingResult> {
    const response = await fetch(`/api/image/${image.name}`, {
      body: image.data,
      method: 'POST'
    })
    if (response.ok) {
      await refetch()
      return { success: true }
    }
    else {
      return { success: false, message: response.statusText }
    }
  }

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
            <ImageUpload onImageUploading={uploadImage} />
            {urls.map((url, index) => {
              return (<ImageItem key={index} imageUrl={url} onDeleting={deleteImage}/>)
            })}
          </MainGrid>
        ))
      .exhaustive()}
    </>
  )    
}