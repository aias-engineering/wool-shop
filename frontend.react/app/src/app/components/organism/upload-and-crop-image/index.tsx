'use client'

import { useState } from "react"
import ReactImageUploading, { ImageListType, ImageType } from "react-images-uploading"
import { match } from "ts-pattern"
import Button from "@/app/components/atoms/button"
import NaqabCropper from "../../naqab-cropper"
import OverlayContainer, { Overlay } from "@/app/components/atoms/overlay-container"
import { Area } from "react-easy-crop"
import cropImage from "../../atoms/image-cropper/cropUtils"
import { ImageUp } from "lucide-react"

export interface Image {
  data: Blob,
  name: string
}

interface Props {
  onImageCroped: (images: Image) => Promise<void>
}

type State = 
  | { step: 'showUpload' }
  | { step: 'showCrop', image: ImageType, imageName: string }
  | { step: 'error', message: string }

export default function UploadAndCropImage({onImageCroped}: Props) {
  const [state, setState] = useState<State>({step: 'showUpload'})
  const [uploadedImages, setUploadedImages] = useState<ImageListType>([])
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  async function handleImageUploadChange(value: ImageListType): Promise<void> {
    await setUploadedImages(value)
    const image = value.at(0)
    if (image) {
      const imageName = image.file?.name
      if (imageName)
        setState({ step: 'showCrop', image, imageName })
      else
        setState({step: 'error', message: 'when accessing file of uploaded image nothing happened'})  
    }
    else
      setState({step: 'error', message: 'when accessing uploaded image nothing happened'})
  }

  async function handleImageCrop(image: ImageType, imageName: string) {
    console.log('cropping image...')

    const blobCallback = async (blob: Blob | null) => {
      if (blob) {
        await setState({step: 'showUpload'})
        await onImageCroped({data: blob, name: imageName})
      }
      else {
        await setState({step: 'error', message: 'Couldnt create the blob'})
      }
    }
    await setState({step: 'error', message: 'cropping'})
    await cropImage(image.dataURL!, croppedAreaPixels!, blobCallback)
  }

  return match(state)
    .with({step: 'showUpload'}, () => (
      <ReactImageUploading value={uploadedImages} onChange={handleImageUploadChange}>
        {({onImageUpload, onImageUpdate}) => (
          <Button onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>
            <ImageUp /> afbeelding uploaden
          </Button>
        )}
      </ReactImageUploading>
    ))
    .with({step: 'showCrop'}, ({image, imageName}) => (
      <OverlayContainer>
        <NaqabCropper imageUrl={image.dataURL!} 
                      onCropComplete={async (area) => { await setCroppedAreaPixels(area) }} />
        <Overlay>
          <Button onClick={async () => { await handleImageCrop(image, imageName)}}>
            finish
          </Button>
        </Overlay>
      </OverlayContainer>
    ))
    .otherwise(() => <></>)
}