'use client'

import './_images-grid.css'
import { atom, useAtom } from 'jotai'
import { match } from 'ts-pattern'
import { AlertCircle } from 'lucide-react'
import UploadAndCropImage, { Image } from '@/app/components/organism/upload-and-crop-image'
import Alert, { AlertDescription, AlertTitle } from '@/app/components/molecules/alert'
import Alertable, { AlertableAlert } from '@/app/components/atoms/alertable'
import Spinner from '@/app/components/atoms/spinner'
import { fetchImagesAction } from './store'

type ImageUpoadState = 
  | { step: 'idle' }
  | { step: 'uploading', name: string }
  | { step: 'error', message: string }

const imageUploadState = atom<ImageUpoadState>({ step: 'idle' })

const uploadImageAction = atom(null, async (_, set, image: Image) => {
  set(imageUploadState, { step: 'uploading', name: image.name })

  const response = await fetch(`/api/image/${image.name}`, {
    body: image.data,
    method: 'POST'
  })

  if (response.ok) {
    set(imageUploadState, { step: 'idle' })
    set(fetchImagesAction)
  }
  else {
    set(imageUploadState, { step: 'error', message: response.statusText })
  }
})

export default function ImageUpload(): JSX.Element {
  const [state] = useAtom(imageUploadState)
  const [, uploadImage] = useAtom(uploadImageAction)

  return (
    <>
      {match(state)
        .with({step:'idle'}, () => (
          <div className="images-grid__upload">
            <UploadAndCropImage onImageCroped={uploadImage} />
          </div>
        ))
        .with({step: 'uploading'}, ({name}) => (
          <Alertable>
            <AlertableAlert>
              <Spinner />
              Uploading {name}..
            </AlertableAlert>
          </Alertable>
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