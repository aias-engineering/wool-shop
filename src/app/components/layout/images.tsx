import HasChildren from '@/lib/client/react/has-children'
import './_images.css'

const ImagesLayout = ({ children }: HasChildren) => (
  <>
    <div className={'images-layout'}>{children}</div>
  </>
)

export const ImagesLayoutShowCase = ({ children }: HasChildren) => (
  <>
    <div className={'images-layout__showcase'}>{children}</div>
  </>
)

export const ImagesLayoutThumbnails = ({ children }: HasChildren) => (
  <>
    <div className={'images-layout__thumbnails'}>{children}</div>
  </>
)

export default ImagesLayout
