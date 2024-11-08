'use client'

import { match } from "ts-pattern"
import Button from "../../atoms/button"
import { FileImage, ImageIcon } from "lucide-react"
import Grid from "@/app/components/atoms/grid"
import ImageItem from "../images-grid/item"
import { imagesFetchAtom } from "@/lib/client/store"
import ImageUploadButton, { UploadedImage } from "../../atoms/image-upload-button"
import { useState } from "react"
import { PrimitiveAtom } from "jotai"
import ImageCropper, { CroppedImage } from "../../atoms/image-cropper"
import { Atom } from "jotai"
import { ImagesFetch } from "@/lib/client/store/image"

type State =
  | { step: 'idle' }
  | { step: 'choose-mode' }
  | { step: 'choose-image', imagesFetch: ImagesFetch }
  | { step: 'image-uploaded', uploadedImage: PrimitiveAtom<UploadedImage> }

export default function ImageChoser() {
  const [imagesFetch, setImagesFetch] = useAtom(imagesFetchAtom)
  
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
            <ImageUploadButton onImageAtomUploaded={handleImageUploaded} />
            <Button onClick={async () => setState({step: 'choose-image', imagesFetch})}>
              <ImageIcon />
              een afbeelding kiezen
            </Button>
          </div>
        ))
        .with({step: 'image-uploaded'}, ({uploadedImage}) => (
          <ImageCropper uploadedImageAtom={uploadedImage} onImageCropped={handleImageCropped} />
        ))
        .with({step: 'choose-image'}, ({imagesFetch}) => (
          <>
            {match(imagesFetch)
              .with({step: 'fetched'}, ({data}) => (
                <Grid>
                  {data.map((image, index) => (
                    <ImageItem key={index} imageAtom={image} />
                  ))}
                </Grid>
              ))
              .otherwise(() => <></>)}
          </>
        ))
        .exhaustive()}
    </>
  )
}