import { Provider } from 'jotai'
import Button from "@/app/components/atoms/button"
import TextArea from "@/app/components/textarea"
import TextBox from "@/app/components/textbox"
import { handleCreateProductForm } from './actions'
import { getImages } from '@/lib/services/images'
import Grid from '@/app/components/atoms/grid'

const Page = async () => {
  const images = await getImages()

  return (
    <Provider>
      <form action={handleCreateProductForm}>
        <Grid className='grid--2-cols'>
          <div>
            Images
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