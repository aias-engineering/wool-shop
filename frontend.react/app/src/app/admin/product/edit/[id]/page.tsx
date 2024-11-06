import Button from "@/app/components/atoms/button"
import ImageOrPlaceholder from "@/app/components/atoms/image-or-placeholder"
import ImagesLayout, { ImagesLayoutShowCase, ImagesLayoutThumbnails } from "@/app/components/layout/images"
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