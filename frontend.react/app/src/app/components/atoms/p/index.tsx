import HasChildren from '@/lib/client/react/has-children';
import './_p.css'

export default function P({children}: HasChildren) {
  return (
    <p className='p'>{children}</p>
  )
}