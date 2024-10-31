import ImageUpload from './upload'

export default {
  title: 'organism/image-upload',
  component: ImageUpload
}

export function SuccessfulUpload() {

  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageUpload />
    </div>
  )
}

export function FailedUpload() {

  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageUpload />
    </div>
  )
}