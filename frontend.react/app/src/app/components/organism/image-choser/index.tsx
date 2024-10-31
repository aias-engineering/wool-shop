'use client'

import { match } from "ts-pattern"
import Button from "../../atoms/button"
import { FileImage, ImageIcon } from "lucide-react"
import MainGrid from "../../grids/main"
import ImageItem from "../images-grid/item"
import { atom, useAtom, useSetAtom } from "jotai"
import { Image, imagesAtom } from "../images-grid/store"
import ImageUploadButton, { UploadedImage } from "../../atoms/image-upload-button"
import { useState } from "react"
import { PrimitiveAtom } from "jotai"
import ImageCropper, { CroppedImage } from "../../atoms/image-cropper"
import { Atom } from "jotai"

type State =
  | { step: 'idle' }
  | { step: 'choose-mode' }
  | { step: 'choose-image' }
  | { step: 'image-uploaded', uploadedImage: PrimitiveAtom<UploadedImage> }

interface Props {
  images: string[]
}

export function PreLoadedImageChoser({images}: Props) {
  const setImages = useSetAtom(imagesAtom)

  
  setImages(images.map(imageUrl => atom<Image>({url: imageUrl})))

  return (<ImageChoser />)
}

export default function ImageChoser() {
  const [imagesArray, setImages] = useAtom(imagesAtom)
  const [state, setState] = useState<State>({step: 'idle'})

  async function handleImageUploaded(uploadedImage: PrimitiveAtom<UploadedImage>) {
    await setState({step: 'image-uploaded', uploadedImage})
  }
  
  async function handleImageCropped(croppedImage: Atom<CroppedImage|'Crop failed'>) {
    
    console.log(' a lot to do still... ')
  }
  
  return (
    <>
      {match(state)
        .with({step: 'idle'}, () => (
          <Button onClick={async () => setState({step: 'choose-mode'})}>
            <FileImage />
            afbeelding toevoegen
          </Button>
        ))
        .with({step: 'choose-mode'}, () => (
          <div>
            <ImageUploadButton onImageUploaded={handleImageUploaded} />
            <Button onClick={async () => setState({step: 'choose-image'})}>
              <ImageIcon />
              een afbeelding kiezen
            </Button>
          </div>
        ))
        .with({step: 'image-uploaded'}, ({uploadedImage}) => (
          <ImageCropper uploadedImageAtom={uploadedImage} onImageCropped={handleImageCropped} />
        ))
        .with({step: 'choose-image'}, () => (
          <MainGrid>
            {imagesArray.map((image, index) => (
              <ImageItem key={index} imageAtom={image} />
            ))}
          </MainGrid>
        ))
        .exhaustive()}
    </>
  )
}