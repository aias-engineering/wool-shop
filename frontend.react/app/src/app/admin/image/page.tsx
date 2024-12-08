import { Provider } from 'jotai'
import PreloadedImagesGrid from './preloaded-image-grid'
import { toUrls } from '@/lib/client/store/image'
import Title from '@/app/components/atoms/title'
import { Separator } from '@/app/components/atoms/separator'
import { match, P } from 'ts-pattern'
import ErrorPage from '@/app/components/layout/error-page'
import { ErrorInBlobStorageAccess, isFailure } from '@/lib/server/core/failure'
import { getImages } from '@/lib/server/core/images'
import { withAzureDataAccess } from '@/lib/server'
import { JSX } from 'react'

export default async function Page() {
  const listImagesResult = await withAzureDataAccess((dataAccess) =>
    getImages(dataAccess),
  )

  return (
    <>
      {match<ErrorInBlobStorageAccess | string[], JSX.Element>(listImagesResult)
        .with(P.array(), (imagenames) => (
          <>
            <Provider>
              <Title type="h3">jouw afbeeldingen</Title>
              <Separator orientation="horizontal" />
              <PreloadedImagesGrid urls={toUrls(imagenames)} />
            </Provider>
          </>
        ))
        .with(P.when(isFailure), ({ reason }) => (
          <ErrorPage message={reason} />
        ))
        .exhaustive()}
    </>
  )
}
