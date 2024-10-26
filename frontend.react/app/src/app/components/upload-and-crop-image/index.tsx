'use client'

import { useState } from 'react'
import { Area } from 'react-easy-crop'
import ReactImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import {match} from 'ts-pattern'
import Button from '@/app/components/atoms/button'
import ImagesLayout, { ImagesLayoutShowCase, ImagesLayoutThumbnails } from '../layout/images'
import NaqabCropper from '../naqab-cropper'
import cropImage from './cropUtils'

interface Props {
  maxImages?: number,
  onImagesCroped?: (images: Image[]) => void
}

export interface Image {
  name: string,
  dataURL: string
}

interface State {
  status:
    | { step: 'showOnlyUpload'}
    | { step: 'showCrop', image: ImageType, imageName: string }
    | { step: 'showUploadWithUploaded' }
    | { step: 'error', message: string }
}

const UploadAndCropImage = ({onImagesCroped}: Props) => {
  const [state, setState] = useState<State>({status: {step: 'showOnlyUpload'}})
  const [uploadedImages, setUploadedImages] = useState<ImageListType>([])
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [croppedImages, setCroppedImages] = useState<Image[]>([])

  function handleImageUpload(value: ImageListType): void {
    setUploadedImages(value)
    const image = value.at(0);
    if (image) {
      const imageName = image.file?.name
      if (imageName)
        setState({status: { step: 'showCrop', image, imageName }})
      else
      setState({status: { step: 'error', message: 'when accessing file of uploaded image nothing happened'}})  
    }
    else
      setState({status: { step: 'error', message: 'when accessing uploaded image nothing happened'}})
  }

  async function handleImageCrop(image: ImageType, imageName: string) {
    const croppedImage = await cropImage(image.dataURL!, croppedAreaPixels!)
    await setCroppedImages([{ name: imageName, dataURL: croppedImage }, ...croppedImages])
    await setState({status: {step: 'showUploadWithUploaded'}})
    if (onImagesCroped) 
      onImagesCroped(croppedImages)
  }

  return (
    <>
      {match(state.status)
        .with({step: 'showOnlyUpload'}, () => (
          <>
            <ImagesLayout>
              <ImagesLayoutShowCase>
                <ReactImageUploading value={uploadedImages} onChange={handleImageUpload}>
                  {({onImageUpload, onImageUpdate}) => (
                    <>
                      <Button onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>+</Button>
                    </>
                  )}
                </ReactImageUploading>
              </ImagesLayoutShowCase>
            </ImagesLayout>
          </>
        ))
        .with({step: 'showCrop'}, ({image, imageName}) => (
          <>
            <ImagesLayout>
              <ImagesLayoutShowCase>
              <NaqabCropper imageUrl={image.dataURL!} 
                              onCropComplete={async (area) => { await setCroppedAreaPixels(area) }} />
              </ImagesLayoutShowCase>
              <ImagesLayoutThumbnails>
                <Button onClick={async () => { await handleImageCrop(image, imageName)}}>
                  finish
                </Button>
              </ImagesLayoutThumbnails>
            </ImagesLayout>
          </>
        ))
        .with({step: 'error'}, ({message})=> (
          <div><span>{message}</span></div>
        ))
        .otherwise(() => (<></>))
      }
    </>
  )
}

export default UploadAndCropImage