import ImageOrPlaceHolder from '.'

export default {
  title: 'atoms/image-or-placeholder',
  component: ImageOrPlaceHolder,
}

export function FoundImage() {
  return (
    <ImageOrPlaceHolder
      src="https://www.dndbeyond.com/attachments/0/17/items.jpg"
      alt="dnd-beyond-image"
    />
  )
}

export function ImageWithNullSource() {
  return (
    <div style={{ height: '300px', width: '200px' }}>
      <ImageOrPlaceHolder src={null} alt="there should be a placeholder" />
    </div>
  )
}

export function ImageWithErrorSurce() {
  return (
    <div style={{ height: '300px', width: '200px' }}>
      <ImageOrPlaceHolder
        src="/api/image/not-found"
        alt="there should be a placeholder"
      />
    </div>
  )
}
