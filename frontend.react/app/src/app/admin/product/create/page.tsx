import { Provider } from 'jotai'
import Button from '@/app/components/atoms/button'
import TextArea from '@/app/components/atoms/textarea'
import { handleCreateProductForm } from './actions'
import Grid from '@/app/components/atoms/grid'
import Title from '@/app/components/atoms/title'
import { Separator } from '@/app/components/atoms/separator'
import { toUrls } from '@/lib/client/store/image'
import PreloadedImagesChooser from './preloaded-image-choser'
import Input, { toId } from '@/app/components/atoms/input'
import Label from '@/app/components/atoms/label'
import Space from '@/app/components/atoms/space'
import { match, P } from 'ts-pattern'
import ErrorPage from '@/app/components/layout/error-page'
import { ErrorInBlobStorageAccess } from '@/lib/server/core/failure'
import { getImages } from '@/lib/server/core/images'
import { withAzureDataAccess } from '@/lib/server'

const Page = async () => {
  const readImagesResult = await withAzureDataAccess((dataAccess) =>
    getImages(dataAccess),
  )

  return match<ErrorInBlobStorageAccess | string[], JSX.Element>(
    readImagesResult,
  )
    .with(P.array(), (imagenames) => (
      <Provider>
        <Title type="h3">een product creëren</Title>
        <Separator />
        <form action={handleCreateProductForm}>
          <Grid className="grid--2-cols">
            <div>
              <PreloadedImagesChooser urls={toUrls(imagenames)} />
            </div>
            <div>
              <Title type="h4">Productinformatie in nederlands</Title>
              <Space className="space--top-1">
                <Label htmlFor={toId('name')}>naam</Label>
                <Input name="name" type="text" required />
              </Space>
              <Space className="space--top-1">
                <Label htmlFor={toId('description')}>beschrijving</Label>
                <TextArea name="description"></TextArea>
              </Space>
              <Space className="space--top-1">
                <Label htmlFor={toId('price')}>prijs in euro</Label>
                <Input name="price" type="number" required />
              </Space>
            </div>
            <div style={{ gridColumn: '1 span 2', justifyContent: 'end' }}>
              <Button>Save</Button>
            </div>
          </Grid>
        </form>
      </Provider>
    ))
    .with(P.instanceOf(ErrorInBlobStorageAccess), ({ reason }) => (
      <ErrorPage message={reason} />
    ))
    .exhaustive()
}

export default Page
