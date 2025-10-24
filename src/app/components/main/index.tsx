import { HasChildren, MightHaveClassName } from '@/lib/client/react'
import clsx from 'clsx'

interface Props extends HasChildren, MightHaveClassName {}

const Main = ({ children, className }: Props) => (
  <>
    <main className={clsx("p-2 w-[23rem] md:w-[40rem] lg:w-[48rem] xl:w-[80rem] mx-auto", className)}>
      {children}
    </main>
  </>
)

export default Main
