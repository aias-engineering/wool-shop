import clsx from 'clsx'
import { HasChildren, MightHaveClassName } from '@/lib/client/react'

const Header = ({ children, className }: HasChildren & MightHaveClassName) => (
  <>
    <header className={clsx('bg-black flex flex-col gap-2 p-5', className)}>
      {children}
    </header>
  </>
)

export default Header
