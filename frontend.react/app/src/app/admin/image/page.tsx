import { Provider } from 'jotai'
import PreloadedImagesGrid from './preloaded-image-grid'
import { toUrls } from '@/lib/client/store/image'
import { match, P } from 'ts-pattern'
import ErrorPage from '@/app/components/layout/error-page'
import { isFailure } from '@/lib/server/core/failure'
import { getImages } from '@/lib/server/core/images'
import { withAzureDataAccess } from '@/lib/server'
import AdminHeaderLayout from '@/app/components/layout/admin/header'
import { AdminMain } from '@/app/components/layout/admin'

export default async function Page() {
  const listImagesResult = await withAzureDataAccess((dataAccess) =>
    getImages(dataAccess),
  )

  return (
    <>
      <AdminHeaderLayout></AdminHeaderLayout>
      <AdminMain>
        {match(listImagesResult)
          .with(P.array(), (imagenames) => (
            <Provider>
              <PreloadedImagesGrid urls={toUrls(imagenames)} />
            </Provider>
          ))
          .with(P.when(isFailure), ({ reason }) => (
            <ErrorPage message={reason} />
          ))
          .exhaustive()}
      </AdminMain>
    </>
  )
}
