import ReactImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import { useState } from 'react'
import { match } from 'ts-pattern'
import cropImage from './cropUtils'
import Button from '../atomics/button'
import NaqabCropper from '../molecules/naqab-cropper'
import { Area } from 'react-easy-crop'
import ImagesLayout, { ImagesLayoutShowCase, ImagesLayoutThumbnails } from '../organisms/layout/images'

interface Props {
  maxImages?: number,
  onImagesCroped: (images: Image[]) => void
}

export interface Image {
  name: string,
  dataURL: string
}

interface UploadAndCropState {
  status: 
    | { step: 'showOnlyUpload' }
    | { step: 'showCrop', image: ImageType, imageName: string }
    | { step: 'showUploadWithUploaded' }
    | { step: 'error', message: string }
}

const UploadAndCropImage = ({maxImages = 5, onImagesCroped}: Props) => {
  const [state, setState] = useState<UploadAndCropState>({status: {step: 'showOnlyUpload'}})
  const [uploadedImages, setUploadedImages] = useState<ImageListType>([])
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
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
    onImagesCroped(croppedImages)
  }

  return (
    <>
      {match(state.status)
        .with({step: 'showOnlyUpload'}, () => (
          <ImagesLayout>
            <ImagesLayoutShowCase>
              <ReactImageUploading value={uploadedImages} onChange={handleImageUpload}>
                {({onImageUpload, onImageUpdate}) => (
                  <Button className={'button--fill'} onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>
                    +
                  </Button>
                )}
              </ReactImageUploading>
            </ImagesLayoutShowCase>
          </ImagesLayout>
        ))
        .with({step: 'showCrop'}, ({image, imageName}) => (
          <>
            <ImagesLayout>
              <ImagesLayoutShowCase>
                <NaqabCropper imageUrl={image.dataURL!} 
                              onCropComplete={async (area) => { await setCroppedAreaPixels(area) }} />
              </ImagesLayoutShowCase>
              <ImagesLayoutThumbnails>
                <Button onClick={async () => { await handleImageCrop(image, imageName) }}>Finish</Button>
              </ImagesLayoutThumbnails>
            </ImagesLayout>
          </>
        ))
        .with({step: 'showUploadWithUploaded'}, () => (
          <>
            <ImagesLayout>
              <ImagesLayoutShowCase>
                <img src={croppedImages.at(0)!.dataURL} style={{height: '100%'}} />
              </ImagesLayoutShowCase>
              {croppedImages.slice(1)
                .map((croppedImage, index) => (
                  <ImagesLayoutThumbnails key={index}>
                    <img src={croppedImage.dataURL} style={{height: '100%'}} />
                  </ImagesLayoutThumbnails>
                ))}
                { (croppedImages.length < maxImages) &&
                  <ImagesLayoutThumbnails>
                    <ReactImageUploading value={uploadedImages} onChange={handleImageUpload}>
                      {({onImageUpload, onImageUpdate}) => (
                        <Button className={'button--fill'} 
                                onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>
                          +
                        </Button>
                      )}
                    </ReactImageUploading>
                  </ImagesLayoutThumbnails>}
            </ImagesLayout>
          </>)
        )
        .with({step: 'error'}, ({message})=> (
          <div><span>{message}</span></div>
        ))
        .otherwise(() => (<></>))}
    </>
  )
}

export default UploadAndCropImage