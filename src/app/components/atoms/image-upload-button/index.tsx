import ReactImageUploading, { ImageListType } from 'react-images-uploading'
import Button from '@/app/components/atoms/button'
import { ImageUp } from 'lucide-react'
import { atom, useAtom, PrimitiveAtom } from 'jotai'
import HasChildren from '@/lib/client/react/has-children'

export interface UploadedImage {
  dataUrl: string
  name: string
}

interface Props extends HasChildren {
  onImageAtomUploaded: (image: PrimitiveAtom<UploadedImage>) => Promise<void>
  onImageUploaded?: (image: UploadedImage) => Promise<void>
}

export const uploadedImagesAtom = atom<PrimitiveAtom<UploadedImage>[]>([])

export default function ImageUploadButton({
  onImageAtomUploaded,
  onImageUploaded,
  children,
}: Props) {
  const [uploadedImages, setUploadedImages] = useAtom(uploadedImagesAtom)

  async function handleChange(images: ImageListType) {
    const imageAtoms = images.map((image) =>
      atom({ dataUrl: image.dataURL!, name: image.file!.name! }),
    )

    if (imageAtoms.length > 0) {
      setUploadedImages(imageAtoms)
      await onImageAtomUploaded(imageAtoms[0])

      if (onImageUploaded) {
        const uploadedImages = images.map((image) => ({
          dataUrl: image.dataURL!,
          name: image.file!.name!,
        }))
        onImageUploaded(uploadedImages[0])
      }
    }
  }

  return (
    <ReactImageUploading value={uploadedImages} onChange={handleChange}>
      {({ onImageUpload, onImageUpdate }) => (
        <Button
          onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}
          type="button"
        >
          {children || (
            <>
              <ImageUp /> afbeelding uploaden
            </>
          )}
        </Button>
      )}
    </ReactImageUploading>
  )
}
