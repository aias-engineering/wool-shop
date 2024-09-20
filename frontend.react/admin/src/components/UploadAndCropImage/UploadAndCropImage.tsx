import ReactImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import styles from './UploadAndCropImage.module.css'
import { useState } from 'react'
import { match } from 'ts-pattern'
import Cropper, { Area, Point } from 'react-easy-crop'
import cropImage from './cropUtils'

export interface UploadAndCropImageProps {
  onImageCroped: (image: string) => void
}

export interface UploadAndCropState {
  status: 
    | { step: 'showOnlyUpload' }
    | { step: 'showCrop', image: ImageType, imageName: string }
    | { step: 'showUploadWithUploaded' }
    | { step: 'error', message: string }
}

export interface Image {
  name: string,
  dataURL: string
}

const UploadAndCropImage = () => {
  const maxImages = 5
  const [state, setState] = useState<UploadAndCropState>({status: {step: 'showOnlyUpload'}})
  const [uploadedImages, setUploadedImages] = useState<ImageListType>([])
  const [crop, setCrop] = useState<Point>({x: 0, y: 0})
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImages, setCroppedImages] = useState<Image[]>([])

  function handleChange(value: ImageListType): void {
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

  return (
    <div className={styles.container}>
      {match(state.status)
        .with({step: 'showOnlyUpload'}, () => (
          <ReactImageUploading value={uploadedImages} onChange={handleChange}>
              {({onImageUpload, onImageUpdate}) => (
                <button className={styles.showCase} 
                        onClick={uploadedImages ? onImageUpload : () => onImageUpdate(0)}>
                  <div>+</div>
                </button>
              )}
            </ReactImageUploading>))
        .with({step: 'showCrop'}, ({image, imageName}) => (
          <div className={styles.showCase}>
            <div style={{position: 'relative', height: '100%'}}>
              <Cropper 
                image={image.dataURL}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                onZoomChange={setZoom} />
            </div>
            <button onClick={async () => {
                  const croppedImage = await cropImage(image.dataURL!, croppedAreaPixels!)
                  await setCroppedImages([...croppedImages, { name: imageName, dataURL: croppedImage }])
                  await setState({status: {step: 'showUploadWithUploaded'}})
                }} >
              Finish!
            </button>
          </div>
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
              ( <ReactImageUploading value={uploadedImages} onChange={handleChange}>
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
    </div>
  )
}

export default UploadAndCropImage