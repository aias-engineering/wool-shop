import { expect, test } from 'vitest'
import { Product, Unit } from './types'
import { match } from 'ts-pattern'
import { deleteImage } from './images'
import { ErrorInBlobStorageAccess, ErrorInCosmosDbAccess, ImageReferencedByProducts } from './failure'

const ID_OF_DELETABLE_IMAGE = 'image-witout-products.avif'
const ID_OF_IMAGE_WITH_PRODUCT = 'wool-sheep.avif'
const ID_OF_NOT_EXISTING_IMAGE = 'not-existing.avif'

const product: Product = {
  id: '1',
  name: 'wool sheep',
  descripiton: null,
  price: '80.00 €',
  image: `/api/image/${ID_OF_IMAGE_WITH_PRODUCT}`
}

const readProductsWithImage = async (id: string) => 
  match(id)
    .with(ID_OF_IMAGE_WITH_PRODUCT, () => [product])
    .otherwise(() => [])

const deleteImageBlob = async(id: string) =>  
  match(id)
    .with(ID_OF_DELETABLE_IMAGE, () => (Unit.done))
    .otherwise(() => { throw 'DELETE FAILED!' })
  

test('deleteImage with deletable image should report success', async () => {
  const result = await deleteImage(ID_OF_DELETABLE_IMAGE, { readProductsWithImage, deleteImageBlob })

  expect(result).toBeInstanceOf(Unit)
})

test('deleteImage with failed deletion should report failure', async () => {
  const result = await deleteImage(ID_OF_NOT_EXISTING_IMAGE, { readProductsWithImage, deleteImageBlob })

  expect(result).toBeInstanceOf(ErrorInBlobStorageAccess)
})

test('delete image with image referenced by products should report failure', async () => {
  const result = await deleteImage(ID_OF_IMAGE_WITH_PRODUCT, { readProductsWithImage, deleteImageBlob })

  expect(result).toBeInstanceOf(ImageReferencedByProducts)
  expect(result).toMatchObject({productnames: ['wool sheep']})
})

test('delete image when cosmos db fails should report that error', async () => {
  const readProductsWithImage = async () => { return new ErrorInCosmosDbAccess(new TypeError('READ PRODUCTS FAILED')) }

  const result = await deleteImage('any-id', { readProductsWithImage, deleteImageBlob })

  expect(result).toBeInstanceOf(ErrorInCosmosDbAccess)
})