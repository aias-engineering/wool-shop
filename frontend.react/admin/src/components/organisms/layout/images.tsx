import { ReactNode } from 'react'
import './_images.css'

interface Props {
  children?: ReactNode
}

const ImagesLayout = ({children}: Props) => (
  <>
    <div className={'images-layout'}>
      {children}
    </div>
  </>
)

export const ImagesLayoutShowCase = ({children}: Props) => (
  <>
    <div className={'images-layout__showcase'}>
      {children}
    </div>
  </>
)

export const ImagesLayoutThumbnails = ({children}: Props) => (
  <>
    <div className={'images-layout__thumbnails'}>
      {children}
    </div>
  </>
)

export default ImagesLayout