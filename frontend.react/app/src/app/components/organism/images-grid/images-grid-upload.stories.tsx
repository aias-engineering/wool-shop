import { Image } from '@/app/components/organism/upload-and-crop-image'
import ImageUpload, { ImageUploadingResult } from './upload'

export default {
  title: 'organism/image-upload',
  component: ImageUpload
}

export function SuccessfulUpload() {

  async function handleImageUploading(): Promise<ImageUploadingResult> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  }

  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageUpload onImageUploading={handleImageUploading} />
    </div>
  )
}

export function FailedUpload() {

  async function handleImageUploading(image: Image): Promise<ImageUploadingResult> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: false, message: 'failed to upload ' + image.name }
  }

  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageUpload onImageUploading={handleImageUploading} />
    </div>
  )
}