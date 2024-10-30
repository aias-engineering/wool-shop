'use client'

import { match } from "ts-pattern"
import Button from "../../atoms/button"
import { FileImage, ImageIcon, ImageUp } from "lucide-react"
import MainGrid from "../../grids/main"
import ImageItem from "../images-grid/item"
import ImageUpload, { ImageUploadingResult } from "../images-grid/upload"
import { atom, useAtom } from "jotai"

type State =
  | { step: 'idle' }
  | { step: 'choose-mode' }
  | { step: 'choose-image' }
  | { step: 'upload-image' }

interface Props {
  images: string[]
}

const imagesAtom = atom<string[]>([]);
const stateAtom = atom<State>({step: 'idle'});

export default function ImageChoser({images}: Props) {
  const [imagesArray, setImages] = useAtom(imagesAtom)
  const [state, setState] = useAtom(stateAtom)

  setImages(images)

  async function handleImageUploading(): Promise<ImageUploadingResult> {
    return { success: false, message: 'not implemented' }
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
            <Button onClick={async () => setState({step: 'upload-image'})}>
              <ImageUp />
              afbeelding uploaden
            </Button>
            <Button onClick={async () => setState({step: 'choose-image'})}>
              <ImageIcon />
              een afbeelding kiezen
            </Button>
          </div>
        ))
        .with({step: 'upload-image'}, () => (
          <ImageUpload onImageUploading={handleImageUploading} />
        ))
        .with({step: 'choose-image'}, () => (
          <MainGrid>
            {imagesArray.map((image, index) => (
              <ImageItem key={index} imageUrl={`/api/image/${image}`} />
            ))}
          </MainGrid>
        ))
        .exhaustive()}
    </>
  )
}