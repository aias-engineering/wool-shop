import { Provider } from 'jotai'
import Button from "@/app/components/atoms/button"
import TextArea from "@/app/components/atoms/textarea"
import { handleCreateProductForm } from './actions'
import { getImages } from '@/lib/services/images'
import Grid from '@/app/components/atoms/grid'
import Title from '@/app/components/atoms/title'
import { Separator } from '@/app/components/atoms/separator'
import { toUrls } from '@/lib/client/store/image'
import PreloadedImagesChooser from './preloaded-image-choser'
import Input, { toId } from '@/app/components/atoms/input'
import Label from '@/app/components/atoms/label'
import Space from '@/app/components/atoms/space'

const Page = async () => {
  const images: string[] = await getImages()
  const urls: string[] = toUrls(images)

  return (
    <Provider>
      <Title type='h3'>een product creëren</Title>
      <Separator />
      <form action={handleCreateProductForm}>
        <Grid className='grid--2-cols'>
          <div>
            <PreloadedImagesChooser urls={urls} />
          </div>
          <div>
            <Title type='h4' >Productinformatie in nederlands</Title>
            <Space className='space--top-1'>
              <Label htmlFor={toId('name')}>naam</Label>
              <Input name='name' type='text' required />
            </Space>
            <Space className='space--top-1'>
              <Label htmlFor={toId('description')}>beschrijving</Label>
              <TextArea name="description" ></TextArea>
            </Space>
            <Space className='space--top-1'>
              <Label htmlFor={toId('price')}>prijs in euro</Label>
              <Input name='price' type='number' required />
            </Space>
          </div>
          <div style={{ gridColumn: '1 span 2', justifyContent: 'end' }}>
            <Button>
              Save
            </Button>
          </div>
        </Grid>
        
      </form>
    </Provider>
  )
}

export default Page