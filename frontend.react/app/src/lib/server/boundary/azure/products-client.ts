import { products } from './cosmos-db-client'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { Product } from '@/lib/server/core/types'

export const readAllProducts = (): Promise<ErrorInCosmosDbAccess | Product[]> =>
  products()
    .then((container) => container.items.readAll<Product>().fetchAll())
    .then(
      (response) => response.resources as Product[],
      (error) => new ErrorInCosmosDbAccess(error),
    )

export function readProductsWithImage(
  imagename: string,
): Promise<Product[] | ErrorInCosmosDbAccess> {
  return products()
    .then((container) =>
      container.items
        .query({
          query: 'SELECT * FROM Products p WHERE p.image = @imagename',
          parameters: [{ name: '@imagename', value: imagename }],
        })
        .fetchAll(),
    )
    .then((response) => response.resources as Product[])
    .catch((err) => new ErrorInCosmosDbAccess(err))
}
