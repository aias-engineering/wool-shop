import { Provider } from 'jotai'
import Title from '@/app/components/atoms/title'
import { match, P } from 'ts-pattern'
import ErrorPage from '@/app/components/layout/error-page'
import { ErrorInBlobStorageAccess, isFailure } from '@/lib/server/core/failure'
import { getImages } from '@/lib/server/core/images'
import { withAzureDataAccess } from '@/lib/server'
import HeaderLayout from '@/app/components/layout/header'
import { CreateProductWizard } from './create-product-wizard'
import Main from '@/app/components/main'

const Page = async () => {
  const readImagesResult = await withAzureDataAccess((dataAccess) =>
    getImages(dataAccess),
  )

  return match<ErrorInBlobStorageAccess | string[], JSX.Element>(
    readImagesResult,
  )
    .with(P.array(), (imagenames) => (
      <Provider>
        <HeaderLayout>
          <Title type='h2' className='text-white'>
            Admin UI
          </Title>
        </HeaderLayout>
        <Main>
          <CreateProductWizard urls={imagenames}>
          </CreateProductWizard>  
        </Main>
      </Provider>
    ))
    .with(P.when(isFailure), ({ reason }) => <ErrorPage message={reason} />)
    .exhaustive()
}

export default Page
