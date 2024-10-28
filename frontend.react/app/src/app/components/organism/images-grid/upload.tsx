'use client'

import './_images-grid.css'
import { useState } from 'react'
import UploadAndCropImage, { Image } from '@/app/components/organism/upload-and-crop-image'
import { match } from 'ts-pattern'
import { AlertCircle, Terminal } from 'lucide-react'
import Alert, { AlertDescription, AlertTitle } from '../../molecules/alert'

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
          <Alert>
            <Terminal />
            <AlertTitle>Uploading {name}..</AlertTitle>
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
        .exhaustive()}
    </>
  )  
}