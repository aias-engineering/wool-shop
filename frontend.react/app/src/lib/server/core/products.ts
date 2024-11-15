import { ReadAllProducts } from './data-access'
import { ErrorInCosmosDbAccess } from './failure'
import { Product } from './types'

export const getAllProducts = (
  dataAccess: ReadAllProducts,
): Promise<Product[] | ErrorInCosmosDbAccess> => dataAccess.readAllProducts()
