import AdminHeaderLayout from '@/app/components/layout/admin/header'
import { AdminMain } from '../components/layout/admin'

async function Page() {
  return (
    <>
      <AdminHeaderLayout></AdminHeaderLayout>
      <AdminMain></AdminMain>
    </>
  )
}

export default Page
