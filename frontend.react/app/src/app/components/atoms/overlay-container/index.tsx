import { ReactNode } from "react";
import classNames from 'clsx';
import './_overlay-container.css'

interface Props {
  className?: string,
  children?: ReactNode
}

const OverlayContainer = ({className, children}: Props) => (
  <>
    <div className={classNames("overlay-container", className)}>
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