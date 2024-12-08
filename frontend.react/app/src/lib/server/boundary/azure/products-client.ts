import { products } from './cosmos-db-client'
import {
  ErrorInCosmosDbAccess,
  ProductWithIdNotFound,
} from '@/lib/server/core/failure'
import { Product, Unit } from '@/lib/server/core/types'

export const readAllProducts = (): Promise<ErrorInCosmosDbAccess | Product[]> =>
  products()
    .then((container) => container.items.readAll<Product>().fetchAll())
    .then(
      (response) => response.resources as Product[],
      (error) => ErrorInCosmosDbAccess(error),
    )

export const readProductsWithImage = (
  imagename: string,
): Promise<Product[] | ErrorInCosmosDbAccess> =>
  products()
    .then((container) =>
      container.items
        .query({
          query: 'SELECT * FROM Products p WHERE p.image = @imagename',
          parameters: [{ name: '@imagename', value: imagename }],
        })
        .fetchAll(),
    )
    .then((response) => response.resources as Product[])
    .catch((err) => ErrorInCosmosDbAccess(err))

export const readProduct = (
  id: string,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.item(id, id).read<Product>())
    .then((response) => response.resource || ProductWithIdNotFound(id))
    .catch((error) => ErrorInCosmosDbAccess(error))

export const deleteProduct = (
  id: string,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.item(id, id).delete())
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))
