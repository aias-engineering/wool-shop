import ImageItem from './item'

export default {
  title: 'organism/image-item',
  component: ImageItem
}

export function ShowAnImage() {
  return (
    <div style={{height: '400px', width: '300px'}}>
      <ImageItem name='stiria.jpg' onDeleted={async () => {}} />
    </div>
  )
}