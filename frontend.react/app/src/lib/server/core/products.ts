import { ReadAllProducts, ReadProduct } from './data-access'
import { ErrorInCosmosDbAccess, ProductWithIdNotFound } from './failure'
import { Product } from './types'

export const getAllProducts = (
  dataAccess: ReadAllProducts,
): Promise<Product[] | ErrorInCosmosDbAccess> => dataAccess.readAllProducts()

export const getProduct = (
  id: string,
  dataAccess: ReadProduct,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  dataAccess.readProduct(id)
