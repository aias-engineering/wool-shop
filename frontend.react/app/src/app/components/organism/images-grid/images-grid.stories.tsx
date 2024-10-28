import Images from '.'

export default {
  title: 'organism/image-grid',
  component: Images
}

export function ShowAll() {
  const blobnames = ['stiria.jpg', 'blobs.png', 'anyotherpicture.png', 'withoutending']

  return (
    <Images blobnames={blobnames} />
  )
}