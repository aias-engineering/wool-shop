import { expect, test } from 'vitest'
import { Product, Unit } from './types'
import { match } from 'ts-pattern'
import { deleteImage } from './images'
import { ErrorInCosmosDbAccess } from './failure'

const ID_OF_DELETABLE_IMAGE = 'image-witout-products.avif'
const ID_OF_IMAGE_WITH_PRODUCT = 'wool-sheep.avif'
const ID_OF_NOT_EXISTING_IMAGE = 'not-existing.avif'

const product: Product = {
  id: '1',
  infoNl: {
    name: 'wool sheep',
    description: null,
    price: 80.0,
  },
  image: `/api/image/${ID_OF_IMAGE_WITH_PRODUCT}`,
}

const readProductsWithImage = async (id: string) =>
  match(id)
    .with(ID_OF_IMAGE_WITH_PRODUCT, () => [product])
    .otherwise(() => [])

const deleteImageBlob = async (id: string) =>
  match(id)
    .with(ID_OF_DELETABLE_IMAGE, () => Unit.done)
    .otherwise(() => {
      throw 'DELETE FAILED!'
    })

test('deleteImage with deletable image should report success', async () => {
  const result = await deleteImage(ID_OF_DELETABLE_IMAGE, {
    readProductsWithImage,
    deleteImageBlob,
  })

  expect(result).toEqual(Unit.done)
})

test('deleteImage with failed deletion should report failure', async () => {
  const result = await deleteImage(ID_OF_NOT_EXISTING_IMAGE, {
    readProductsWithImage,
    deleteImageBlob,
  })

  expect(result).toMatchObject({ type: 'failure' })
})

test('delete image with image referenced by products should report failure', async () => {
  const result = await deleteImage(ID_OF_IMAGE_WITH_PRODUCT, {
    readProductsWithImage,
    deleteImageBlob,
  })

  expect(result).toMatchObject({
    type: 'failure',
    productnames: ['1'],
  })
})

test('delete image when cosmos db fails should report that error', async () => {
  const readProductsWithImage = async () => {
    return ErrorInCosmosDbAccess(new TypeError('READ PRODUCTS FAILED'))
  }

  const result = await deleteImage('any-id', {
    readProductsWithImage,
    deleteImageBlob,
  })

  expect(result).toMatchObject({ type: 'failure' })
})
