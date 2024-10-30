import { Provider } from 'jotai'
import Button from "@/app/components/atoms/button"
import TextArea from "@/app/components/textarea"
import TextBox from "@/app/components/textbox"
import { handleCreateProductForm } from './actions'
import ImageChoser from "@/app/components/organism/image-choser"
import { getImages } from '@/lib/services/images'

const Page = async () => {
  const images = await getImages()

  return (
    <Provider>
      <form action={handleCreateProductForm}>
        <div style={{ display: 'grid', gridTemplateColumns: '45dvw 45dvw' }}>
          <div style={{ gridColumn: 1 }}>
            <ImageChoser images={images} />
          </div>
          <div style={{ gridColumn: 2 }}>
            <TextBox name="name" label="naam" value="" />
            <TextArea name="description" label="beschrijving" />
            <TextBox name="price" label="prijs" value="" />
          </div>
          <div style={{ gridColumn: 2 }}>
            <Button>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Provider>
  )
}

export default Page