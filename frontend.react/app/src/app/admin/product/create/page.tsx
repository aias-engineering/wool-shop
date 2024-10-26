import Button from "@/app/components/button"
import TextArea from "@/app/components/textarea"
import TextBox from "@/app/components/textbox"
import { handleCreateProductForm } from './actions'
import ImageChoser from "./image-choser"

const Page = () => {
  return (
    <>
      <form action={handleCreateProductForm}>
        <div style={{ display: 'grid', gridTemplateColumns: '45dvw 45dvw' }}>
          <div style={{ gridColumn: 1 }}>
            <ImageChoser />
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
    </>
  )
}

export default Page