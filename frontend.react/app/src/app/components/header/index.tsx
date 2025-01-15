import clsx from 'clsx'
import { HasChildren, MightHaveClassName } from '@/lib/client/react'

const Header = ({ children, className }: HasChildren & MightHaveClassName) => (
  <>
    <header className={clsx('bg-white flex flex-col gap-2 p-5', 'w-[23rem] md:w-[40rem] lg:w-[48rem] xl:w-[80rem] mx-auto', className)}>
      {children}
    </header>
  </>
)

export default Header
