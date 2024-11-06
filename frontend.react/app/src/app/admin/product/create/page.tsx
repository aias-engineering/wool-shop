import { Provider } from 'jotai'
import Button from "@/app/components/atoms/button"
import TextArea from "@/app/components/textarea"
import TextBox from "@/app/components/textbox"
import { handleCreateProductForm } from './actions'
import { getImages } from '@/lib/services/images'
import Grid from '@/app/components/atoms/grid'
import Title from '@/app/components/atoms/title'
import { Separator } from '@/app/components/atoms/separator'
import { toUrls } from '@/lib/client/store/image'
import PreloadedImagesChooser from './preloaded-image-choser'

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
            <TextBox name="name" label="naam" value="" />
            <TextArea name="description" label="beschrijving" />
            <TextBox name="price" label="prijs" value="" />
          </div>
          <div style={{ gridColumn: 2 }}>
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