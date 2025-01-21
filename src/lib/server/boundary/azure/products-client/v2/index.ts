import { woolshopDatabase } from '../../cosmos-db-client'
import {
  ErrorInCosmosDbAccess,
} from '@/lib/server/core/failure'
import { Unit } from '@/lib/server/core/types'
import { Container } from '@azure/cosmos'
import { AzureCreateProductRequestV2, AzureCreateProductResponseV2, AzureProductInfoV2, AzureProductV2 } from './types'
import { CreateProductRequest } from '@/lib/server/core/data-access'

async function products(): Promise<Container> {
  const database = await woolshopDatabase()
  const { container } = await database.containers.createIfNotExists({
    id: 'products',
    partitionKey: '/id',
  })
  return container
}

const createProduct = (
  request: AzureCreateProductRequestV2,
): Promise<AzureCreateProductResponseV2 | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.items.create(request))
    .then((result) => ({ id: result.item.id, request: request }))
    .catch((error) => ErrorInCosmosDbAccess(error))

const upsertProduct = (
  product: AzureProductV2,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.items.upsert(product))
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))

const azureProductV2Client = {
  createProduct,
  upsertProduct,
}

export default azureProductV2Client

export const toAzureCreateProductRequestV2 = (request: CreateProductRequest): AzureCreateProductRequestV2 => (request)