import { atom, useSetAtom } from 'jotai'
import ImagesGrid from '.'
import { imagesFetchAtom } from '@/lib/client/store'
import { toUrls } from '@/lib/client/store/image'

export default {
  title: 'organism/image-grid',
  component: ImagesGrid,
}

export function ShowAll() {
  const blobnames = [
    'stiria.jpg',
    'blobs.png',
    'anyotherpicture.png',
    'withoutending',
  ]

  const setImagesFetch = useSetAtom(imagesFetchAtom)

  setImagesFetch({
    step: 'fetched',
    data: toUrls(blobnames).map((url) => atom({ url })),
  })

  return <ImagesGrid />
}
