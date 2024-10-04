import React, { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

const MenuItem = ({children}: Props) => (
  <>
    <div>
      {children}
    </div>
  </>
)

export default MenuItem