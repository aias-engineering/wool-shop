'use client'

import './_images-grid.css'
import { atom, PrimitiveAtom, useSetAtom } from 'jotai'
import { match } from 'ts-pattern'
import { AlertCircle } from 'lucide-react'
import Alert, { AlertDescription, AlertTitle } from '@/app/components/molecules/alert'
import Alertable, { AlertableAlert } from '@/app/components/atoms/alertable'
import Spinner from '@/app/components/atoms/spinner'
import ImageUploadButton, { type UploadedImage } from '../../atoms/image-upload-button'
import { useState } from 'react'
import ImageCropper, { CroppedImage } from '../../atoms/image-cropper'
import { Atom } from 'jotai'
import { fetchImagesAction } from '@/lib/client/store'

type ImageUpload = {
  success: boolean,
  message: string
}

const lastImageUploadAtom = atom<ImageUpload | null>(null)
const uploadImageAction = atom(null, async (get, set, image: Atom<CroppedImage|'Crop failed'>) => {

  const croppedImage = get(image) as CroppedImage

  if (croppedImage) {
    try {
      const response = await fetch(`/api/image/${(croppedImage.name)}`, {
        body: croppedImage.data,
        method: 'POST'
      })

      if (response.ok) {
        set(lastImageUploadAtom, { success: true , message: 'successfully uploaded' })
        set(fetchImagesAction)
      } else {
        set(lastImageUploadAtom, { success: false , message: response.statusText })
      }
    } catch (error) {
      set(lastImageUploadAtom, { success: false , message: (error as TypeError)?.message })
    }
  }
  else {
    set(lastImageUploadAtom, { success: false , message: 'Crop failed' })
  }
})

type State = 
  | { step: 'idle' }
  | { step: 'image-uploaded', uploadedImage: PrimitiveAtom<UploadedImage> }
  | { step: 'image-cropped', croppedImage: Atom<CroppedImage|'Crop failed'> }
  | { step: 'error', message: string }

export default function ImageUpload(): JSX.Element {
  const [state, setState] = useState<State>({step: 'idle'})
  const uploadImage = useSetAtom(uploadImageAction)

  async function handleImageCropped(croppedImage: Atom<CroppedImage|'Crop failed'>) {
    await setState({step: 'image-cropped', croppedImage})

    await uploadImage(croppedImage)

    await setState({step: 'idle'})
  }

  return (
    <>
      {match(state)
        .with({step:'idle'}, () => (
          <div className="images-grid__upload">
            <ImageUploadButton onImageUploaded={async(uploadedImage) => { 
              await setState({step: 'image-uploaded', uploadedImage }) }}/>
          </div>
        ))
        .with({step: 'image-uploaded'}, ({uploadedImage}) => (
          <ImageCropper uploadedImageAtom={uploadedImage} onImageCropped={handleImageCropped} />
        ))
        .with({step: 'image-cropped'}, () => {
          
          return (
            <Alertable>
              <AlertableAlert>
                <Spinner />
                Uploading..
              </AlertableAlert>
            </Alertable>
          )
        })
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