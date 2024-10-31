import { atom } from 'jotai'
import ImageItem from './item'

export default {
  title: 'organism/image-item',
  component: ImageItem
}

const imageAtom = atom({url: '/api/image/stiria.jpg'})

export function ShowAnImage() {
  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageItem imageAtom={imageAtom} />
    </div>
  )
}