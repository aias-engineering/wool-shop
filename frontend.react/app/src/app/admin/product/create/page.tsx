import { match, P } from 'ts-pattern'
import { isFailure } from '@/lib/server/core/failure'
import { getImages } from '@/lib/server/core/images'
import { withAzureDataAccess } from '@/lib/server'
import { CreateProductWizard } from './create-product-wizard'
import AdminHeaderLayout from '@/app/components/layout/admin/header'
import { AdminMain } from '@/app/components/layout/admin'
import AdminErrorPage from '@/app/components/layout/admin/error-page'

const Page = async () => {
  const readImagesResult = await withAzureDataAccess((dataAccess) =>
    getImages(dataAccess),
  )

  return (
    <>
      <AdminHeaderLayout></AdminHeaderLayout>
      <AdminMain>
        {match(readImagesResult)
          .with(P.array(), (imagenames) => (
            <CreateProductWizard urls={imagenames}></CreateProductWizard>
          ))
          .with(P.when(isFailure), (failure) => (
            <AdminErrorPage failure={failure} />
          ))
          .exhaustive()}
      </AdminMain>
    </>
  )
}

export default Page
