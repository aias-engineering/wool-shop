import HasChildren from '@/lib/client/react/has-children'
import './_paragraph.css'

export default function Paragraph({ children }: HasChildren) {
  return <p className="paragraph">{children}</p>
}
