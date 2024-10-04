import { ReactNode } from "react";
import classNames from 'clsx'
import './_button.css'

interface Props {
  className?: string,
  children?: ReactNode,
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = ({className, children, onClick}: Props) => (
  <>
    <button className={classNames("button", className)} onClick={onClick}>
      {children}
    </button>
  </>
)

export default Button;