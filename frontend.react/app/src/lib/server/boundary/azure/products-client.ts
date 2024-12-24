import { woolshopDatabase } from './cosmos-db-client'
import {
  ErrorInCosmosDbAccess,
  ProductWithIdNotFound,
} from '@/lib/server/core/failure'
import { Product, Unit } from '@/lib/server/core/types'
import { Container } from '@azure/cosmos'
import {
  CreateProduct,
  CreateProductRequest,
  CreateProductResponse,
  DeleteProduct,
  ReadAllProducts,
  ReadProduct,
  ReadProductsWithImage,
} from '@/lib/server/core/data-access'

async function products(): Promise<Container> {
  const database = await woolshopDatabase()
  const { container } = await database.containers.createIfNotExists({
    id: 'products',
    partitionKey: '/id',
  })
  return container
}

const readAllProducts = (): Promise<ErrorInCosmosDbAccess | Product[]> =>
  products()
    .then((container) => container.items.readAll<Product>().fetchAll())
    .then(
      (response) => response.resources as Product[],
      (error) => ErrorInCosmosDbAccess(error),
    )

const readProductsWithImage = (
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

const readProduct = (
  id: string,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.item(id, id).read<Product>())
    .then((response) => response.resource || ProductWithIdNotFound(id))
    .catch((error) => ErrorInCosmosDbAccess(error))

const deleteProduct = (id: string): Promise<Unit | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.item(id, id).delete())
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))

const createProduct = (
  request: CreateProductRequest,
): Promise<CreateProductResponse | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.items.create(request))
    .then((result) => ({ id: result.item.id, request: request }))
    .catch((error) => ErrorInCosmosDbAccess(error))

const productClient: ReadProduct &
  ReadProductsWithImage &
  ReadAllProducts &
  DeleteProduct &
  CreateProduct = {
  readProduct,
  readProductsWithImage,
  readAllProducts,
  deleteProduct,
  createProduct,
}

export default productClient
