import { expect, test } from 'vitest'
import { deleteImage } from './service'
import { DeleteImageBlobResult, Product, ReadProductsResult } from './types'

const product: Product = {
  id: '1',
  name: 'wool sheep',
  descripiton: null,
  price: '80.00 €',
  image: '/api/image/wool-sheep.avif'
}

test('deleteImage with deletable image should report success', async () => {
  const readProductsWithImagePromise = asPromise<ReadProductsResult>({state: 'success', products: []})
  const deleteImagePromise = asPromise<DeleteImageBlobResult>({state: 'success'})

  const result = await deleteImage(readProductsWithImagePromise, deleteImagePromise)

  expect(result).toEqual({state: 'success'})
})

test('deleteImage with failed deletion should report failure', async () => {
  const readProductsWithImagePromise = asPromise<ReadProductsResult>({state: 'success', products: []})
  const deleteImagePromise = asPromise<DeleteImageBlobResult>({state: 'failure', message: 'failure on delete'})

  const result = await deleteImage(readProductsWithImagePromise, deleteImagePromise)

  expect(result).toEqual({state: 'failure', message: 'failure on delete'})
})

test('delete image with image referenced by products should report failure', async () => {
  const readProductsWithImagePromise = asPromise<ReadProductsResult>({state: 'success', products: [product]})
  const deleteImagePromise = asPromise<DeleteImageBlobResult>({ state: 'failure', message: 'delete should not have been called' })

  const result = await deleteImage(readProductsWithImagePromise, deleteImagePromise)

  expect(result).toEqual({state: 'referenced-by-products', products: [product]})
})

test('delete image when cosmos db failse should report that error', async () => {
  const readProductsWithImagePromise = asPromise<ReadProductsResult>({state: 'failure', message: 'cosmos db failure'})
  const deleteImagePromise = asPromise<DeleteImageBlobResult>({ state: 'failure', message: 'delete should not have been called' })

  const result = await deleteImage(readProductsWithImagePromise, deleteImagePromise)

  expect(result).toEqual({state: 'failure', message: 'cosmos db failure'})
})

function asPromise<T>(t: T): Promise<T> { 
  return new Promise<T>(resolve => resolve(t)) 
}