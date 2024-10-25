'use client'

import MainGrid from "@/app/components/main-grid"
import { ImageItem } from "@/app/components/organism/images-management"
import UploadAndCropImage, { Image } from "@/app/components/organism/upload-and-crop-image"
import { useState } from "react"
import { match } from "ts-pattern"

interface Props {
  blobnames: string[]
}

type State =
  | { step: 'fetching', previousBlobnames: string[] }
  | { step: 'fetched', blobnames: string[], uploading: UploadingState }

type UploadingState =
  | { step: 'idle' }
  | { step: 'uploading', name: string }



export default function Images({blobnames}: Props) {
  const [state, setState] = useState<State>({step: 'fetched', blobnames, uploading: { step: 'idle' }})

  async function handleOnImagesCroped(image: Image): Promise<void> {
    await setState({ step: 'fetched', blobnames, uploading: { step: 'uploading', name: image.name }})
    await fetch(`/api/image/${image.name}`, {
      body: image.data,
      method: 'POST'
    })
    await setState({ step: 'fetching', previousBlobnames: blobnames})
    const response = await fetch('/api/image')
    await setState({step: 'fetched', blobnames: await response.json(), uploading: { step: 'idle' }})
  }

  return (
    <>
      {match(state)
        .with({step: 'fetching'}, ({}) => 
          (<>
            fetching...
          </>
        ))
        .with({step: 'fetched'}, ({blobnames, uploading}) => (
          <MainGrid>
            {match(uploading)
              .with({step: 'idle'}, () => (
                <div>
                  <h3>Upload an Image</h3>
                  <UploadAndCropImage onImageCroped={handleOnImagesCroped} />
                </div>
              ))
              .with({step: 'uploading'}, ({name}) => (
                <>
                  uploading {name}...
                </>
              ))
              .exhaustive()
            }
            {blobnames.map((blob, index) => {
              return (
                <ImageItem key={index} src={blob}></ImageItem>
              )
            })}
          </MainGrid>
        ))
      .exhaustive()}
    </>
  )    
}