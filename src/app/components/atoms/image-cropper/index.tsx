import NaqabCropper from '@/app/components/naqab-cropper'
import Button from '@/app/components/atoms/button'
import OverlayContainer, {
  Overlay,
} from '@/app/components/atoms/overlay-container'
import { UploadedImage } from '@/app/components/atoms/image-upload-button'
import { Atom, atom, PrimitiveAtom, useAtomValue } from 'jotai'
import { Area } from 'react-easy-crop'
import { useState } from 'react'
import cropImage from './cropUtils'

export interface CroppedImage {
  data: Blob
  name: string
}

interface Props {
  uploadedImageAtom: PrimitiveAtom<UploadedImage>
  onImageCropped: (image: Atom<CroppedImage | 'Crop failed'>) => Promise<void>
  onCropFailed?: (message: string) => Promise<void>
}

export default function ImageCropper({
  uploadedImageAtom,
  onImageCropped,
}: Props) {
  const uploadedImage = useAtomValue(uploadedImageAtom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  async function handleImageCrop() {
    const blobCallback = async (blob: Blob | null) => {
      const croppedImageAtom = atom<CroppedImage | 'Crop failed'>((get) => {
        if (blob) {
          return {
            data: blob,
            name: get(uploadedImageAtom).name,
          } as CroppedImage
        } else {
          return 'Crop failed'
        }
      })

      onImageCropped(croppedImageAtom)
    }
    await cropImage(uploadedImage.dataUrl, croppedAreaPixels!, blobCallback)
  }

  return (
    <OverlayContainer>
      <NaqabCropper
        imageUrl={uploadedImage.dataUrl}
        onCropComplete={async (area) => await setCroppedAreaPixels(area)}
      />
      <Overlay>
        <Button
          onClick={async () => {
            await handleImageCrop()
          }}
        >
          finish
        </Button>
      </Overlay>
    </OverlayContainer>
  )
}
