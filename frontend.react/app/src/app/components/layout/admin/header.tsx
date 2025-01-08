import { HasChildren } from '@/lib/client/react'
import HeaderLayout from '../header'

const AdminHeaderLayout = ({ children }: HasChildren) => (
  <>
    <HeaderLayout>{children}</HeaderLayout>
  </>
)

export default AdminHeaderLayout
