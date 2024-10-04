import ReactImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import styles from './UploadAndCropImage.module.css'
import { useState } from 'react'
import { match } from 'ts-pattern'
import cropImage from './cropUtils'
import Button from '../atomics/button'
import NaqabCropper from '../molecules/naqab-cropper'

export interface UploadAndCropImageProps {
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

const UploadAndCropImage = ({onImagesCroped}: UploadAndCropImageProps) => {
  const maxImages = 5
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
    await setCroppedImages([...croppedImages, { name: imageName, dataURL: croppedImage }])
    await setState({status: {step: 'showUploadWithUploaded'}})
    onImagesCroped(croppedImages)
  }

  return (
    <>
      {match(state.status)
        .with({step: 'showOnlyUpload'}, () => (
          <ReactImageUploading value={uploadedImages} onChange={handleImageUpload}>
              {({onImageUpload, onImageUpdate}) => (
                <Button className='button--add-showcase-image' onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>
                  +
                </Button>
              )}
            </ReactImageUploading>))
        .with({step: 'showCrop'}, ({image, imageName}) => (
          <>
            <NaqabCropper imageUrl={image.dataURL!} 
                          onCropComplete={async (area) => { await setCroppedAreaPixels(area) }} />
            <div>
              <button onClick={async () => { await handleImageCrop(image, imageName) } } >
                Finish!
              </button>
            </div>
          </>
        ))
        .with({step: 'showUploadWithUploaded'}, () => (
          <>
            <div className={styles.showCase}>
              <img src={croppedImages.at(0)!.dataURL} style={{height: '100%'}} />
            </div>
            {croppedImages.slice(1)
                .map((croppedImage, index) => (
                  <div key={index}>
                    <img src={croppedImage.dataURL} style={{height: '100%'}} />
                  </div>
                ))}
            { (croppedImages.length < maxImages) &&
              ( <ReactImageUploading value={uploadedImages} onChange={handleImageUpload}>
                {({onImageUpload, onImageUpdate}) => (
                  <button className={styles.imgUpload} 
                          onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>
                    <div>+</div>
                  </button>
                )}
                </ReactImageUploading>)}
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