import ReactImageUploading, { ImageListType } from "react-images-uploading";
import Button from '@/app/components/atoms/button'
import { ImageUp } from "lucide-react";
import { atom, useAtom, PrimitiveAtom } from "jotai";

export interface UploadedImage {
  dataUrl: string,
  name: string,
}

interface Props {
  onImageUploaded: (image: PrimitiveAtom<UploadedImage>) => Promise<void> 
}

export const uploadedImagesAtom = atom<PrimitiveAtom<UploadedImage>[]>([]);

export default function ImageUploadButton({onImageUploaded}: Props) {
  const [uploadedImages, setUploadedImages] = useAtom(uploadedImagesAtom)
  
  async function handleChange(images: ImageListType) {
    const imageAtoms = images
      .map(image => atom({dataUrl: image.dataURL!, name: image.file!.name!}))
    
    if (imageAtoms.length > 0) {
      setUploadedImages(imageAtoms)
      await onImageUploaded(imageAtoms[0])
    }
  }

  return (
    <ReactImageUploading value={uploadedImages} onChange={handleChange}>
        {({onImageUpload, onImageUpdate}) => (
          <Button onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>
            <ImageUp /> afbeelding uploaden
          </Button>
        )}
    </ReactImageUploading>
  )
}