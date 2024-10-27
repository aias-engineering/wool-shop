import ImageItem, { DeletingResult } from './item'

export default {
  title: 'organism/image-item',
  component: ImageItem
}

export function ShowAnImage() {

  const  handleDeleting = async (imageUrl: string): Promise<DeletingResult> => {
    await new Promise<void>(resolve => setTimeout(() => {resolve()}, 1000))
    return { deleted: true }
  }

  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageItem imageUrl='stiria.jpg' onDeleting={handleDeleting} />
    </div>
  )
}

export function DeletingFailed() {

  const  handleDeleting = async (imageUrl: string): Promise<DeletingResult> => {
    await new Promise<void>(resolve => setTimeout(() => {resolve()}, 1000))
    return { deleted: false, message: 'couldnt reach the server' }
  }

  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageItem imageUrl='stiria.jpg' onDeleting={handleDeleting} />
    </div>
  )
}