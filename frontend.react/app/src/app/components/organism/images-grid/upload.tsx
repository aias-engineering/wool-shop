'use client'

import { useState } from 'react'
import './_images-grid.css'
import UploadAndCropImage, { Image } from '@/app/components/organism/upload-and-crop-image'
import { match } from 'ts-pattern'

export type ImageUploadingResult =
  | { success: true }
  | { success: false, message: string }

interface Props {
  onImageUploading: (image: Image) => Promise<ImageUploadingResult>
}

type State = 
  | { step: 'idle' }
  | { step: 'uploading', name: string }
  | { step: 'error', message: string }

export default function ImageUpload({onImageUploading}: Props): JSX.Element {
  const [state, setState] = useState<State>({step: 'idle'})

  async function handleImageCropped(image: Image): Promise<void> {
    await setState({ step: 'uploading', name: image.name })
    const result = await onImageUploading(image)
    await match(result)
      .with({success: true}, () => setState({step: 'idle'}))
      .with({success: false}, ({message}) => setState({step: 'error', message}))
      .exhaustive()
  }

  return (
    <>
      {match(state)
        .with({step:'idle'}, () => (
          <div className="images-grid__upload">
            <UploadAndCropImage onImageCroped={handleImageCropped} />
          </div>
        ))
        .with({step: 'uploading'}, ({name}) => (
          <div>
            uploading {name}...
          </div>
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