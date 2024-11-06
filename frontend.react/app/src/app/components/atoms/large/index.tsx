import './_large.css'
import HasChildren from '@/lib/client/react/has-children'

export default function Large({children}: HasChildren) {
  return (
    <div className='large'>
      {children}
    </div>
    )
}