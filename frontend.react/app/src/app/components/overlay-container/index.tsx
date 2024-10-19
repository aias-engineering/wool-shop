import { ReactNode } from "react";
import './_overlay-container.css'

interface Props {
  children?: ReactNode
}

const OverlayContainer = ({children}: Props) => (
  <>
    <div className="overlay-container">
      {children}
    </div>
  </>
)

export const Overlay = ({children}: Props) => (
  <>
    <div className="overlay-container__overlay">
      {children}
    </div>
  </>
)

export default OverlayContainer