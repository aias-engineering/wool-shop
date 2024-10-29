import { match } from "ts-pattern"
import Button from "../../atoms/button"
import { FileImage, ImageIcon, ImageUp } from "lucide-react"
import { useState } from "react"
import MainGrid from "../../grids/main"
import ImageItem from "../images-grid/item"
import ImageUpload, { ImageUploadingResult } from "../images-grid/upload"

type State =
  | { step: 'idle' }
  | { step: 'choose-mode' }
  | { step: 'choose-image' }
  | { step: 'upload-image' }

interface Props {
  images: string[]
}

export default function ImageChoser({images}: Props) {
  const [state, setState] = useState<State>({step: 'idle'})

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
            {images.map((image, index) => (
              <ImageItem key={index} imageUrl={`/api/image/${image}`} />
            ))}
          </MainGrid>
        ))
        .exhaustive()}
    </>
  )
}