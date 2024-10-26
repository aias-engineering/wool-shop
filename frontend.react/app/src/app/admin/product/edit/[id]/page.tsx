import Button from "@/app/components/atoms/button"
import ImageOrPlaceholder from "@/app/components/image"
import ImagesLayout, { ImagesLayoutShowCase, ImagesLayoutThumbnails } from "@/app/components/layout/images"
import TextArea from "@/app/components/textarea"
import TextBox from "@/app/components/textbox"
import { getProduct } from "@/lib/azure/cosmos-client"
import { Product } from "@/lib/azure/entities"
import { match, P } from "ts-pattern"

const firstImage = (product: Product) => (
  match(product.imageLinks)
    .with([P.string], ([link]) => link)
    .otherwise(() => null))

export default async function Page({params}: {params: {id: string}}) { 
  const productId = params.id as string
  const product = await getProduct(productId)

  return (
    <>
      {product !== null
        ? <form>
            <div style={{ display: 'grid', gridTemplateColumns: '45dvw 45dvw' }}>
              <div style={{ gridColumn: 1 }}>
                <ImagesLayout>
                  <ImagesLayoutShowCase>
                    <ImageOrPlaceholder src={firstImage(product)} alt={product.name} />
                  </ImagesLayoutShowCase>
                  <ImagesLayoutThumbnails>
                    <Button>+</Button>
                  </ImagesLayoutThumbnails>
                </ImagesLayout>
              </div>
              <div style={{ gridColumn: 2 }}>
                <TextBox name="name" label="naam" value={product.name} />
                <TextArea name="description" label="beschrijving" value={product.descripiton} />
                <TextBox name="price" label="prijs" value={product.price} />
              </div>
              <div style={{ gridColumn: 2 }}>
                <Button>
                  Save
                </Button>
              </div>
            </div>
          </form>
        : <div>Product not found</div>}
    </>
  )
}