import ImageChoser from '.'

export default {
  title: 'organism/image-choser',
  component: ImageChoser,
}

export function SelectOne() {
  const blobnames = [
    'stiria.jpg',
    'blobs.png',
    'anyotherpicture.png',
    'withoutending',
  ]

  return <ImageChoser images={blobnames} />
}
