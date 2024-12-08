import { DataAccessFacade } from './core/data-access'
import * as azureBlobClient from '@/lib/server/boundary/azure/images-client'
import * as azureCosmosClient from '@/lib/server/boundary/azure/products-client'

export async function withAzureDataAccess<R>(
  func: (dataAccess: DataAccessFacade) => Promise<R>,
) {
  const azureClient: DataAccessFacade = {
    ...azureBlobClient,
    ...azureCosmosClient,
  }
  return func(azureClient)
}
