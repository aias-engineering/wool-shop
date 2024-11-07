import HasChildren from '@/lib/client/react/has-children'
import './_image-frame.css'

export default function ImageFrame({children}: HasChildren) {
  return (
    <div className='image-frame'>
      {children}
    </div>
  )
}