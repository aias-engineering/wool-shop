'use client'

import classNames from 'clsx'
import HasChildren from '@/lib/client/react/has-children'
import './_button.css'

interface Props extends HasChildren {
  className?: string
  onClick?: (() => Promise<void>) | (() => void)
}

const Button = ({ className, children, onClick }: Props) => (
  <>
    <button className={classNames('button', className)} onClick={onClick}>
      {children}
    </button>
  </>
)

export default Button
