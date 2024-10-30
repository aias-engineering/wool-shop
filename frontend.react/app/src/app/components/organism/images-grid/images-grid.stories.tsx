import ImagesGrid from '.'

export default {
  title: 'organism/image-grid',
  component: ImagesGrid
}

export function ShowAll() {
  const blobnames = ['stiria.jpg', 'blobs.png', 'anyotherpicture.png', 'withoutending']

  return (
    <ImagesGrid blobnames={blobnames} />
  )
}