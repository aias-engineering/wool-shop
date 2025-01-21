import { woolshopDatabase } from '../../cosmos-db-client'
import {
  ErrorInCosmosDbAccess,
  ProductWithIdNotFound,
} from '@/lib/server/core/failure'
import { Unit } from '@/lib/server/core/types'
import { Container } from '@azure/cosmos'
import { AzureCreateProductRequestV1, AzureCreateProductResponseV1, AzureProductV1 } from './types'

async function products(): Promise<Container> {
  const database = await woolshopDatabase()
  const { container } = await database.containers.createIfNotExists({
    id: 'products',
    partitionKey: '/id',
  })
  return container
}

const readAllProducts = (): Promise<ErrorInCosmosDbAccess | AzureProductV1[]> =>
  products()
    .then((container) => container.items.readAll<AzureProductV1>().fetchAll())
    .then(
      (response) => response.resources as AzureProductV1[],
      (error) => ErrorInCosmosDbAccess(error),
    )

const readProductsWithImage = (
  imagename: string,
): Promise<AzureProductV1[] | ErrorInCosmosDbAccess> =>
  products()
    .then((container) =>
      container.items
        .query({
          query: 'SELECT * FROM Products p WHERE p.image = @imagename',
          parameters: [{ name: '@imagename', value: imagename }],
        })
        .fetchAll(),
    )
    .then((response) => response.resources as AzureProductV1[])
    .catch((err) => ErrorInCosmosDbAccess(err))

const readProduct = (
  id: string,
): Promise<AzureProductV1 | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.item(id, id).read<AzureProductV1>())
    .then((response) => response.resource || ProductWithIdNotFound(id))
    .catch((error) => ErrorInCosmosDbAccess(error))

const deleteProduct = (id: string): Promise<Unit | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.item(id, id).delete())
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))

const createProduct = (
  request: AzureCreateProductRequestV1,
): Promise<AzureCreateProductResponseV1 | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.items.create(request))
    .then((result) => ({ id: result.item.id, request: request }))
    .catch((error) => ErrorInCosmosDbAccess(error))

const upsertProduct = (
  product: AzureProductV1,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.items.upsert(product))
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))

const azureProductV1Client = {
  readProduct,
  readProductsWithImage,
  readAllProducts,
  deleteProduct,
  createProduct,
  upsertProduct,
}

export default azureProductV1Client
