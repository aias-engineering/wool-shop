import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

const Main = ({ children }: Props) => (
  <>
    <main className='p-2 w-[23rem] md:w-[40rem] lg:w-[48rem] xl:w-[80rem] mx-auto'>{children}</main>
  </>
)

export default Main
