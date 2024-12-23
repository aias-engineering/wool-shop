import { DataAccessFacade } from './core/data-access'
import imagesClient from '@/lib/server/boundary/azure/images-client'
import productsClient from '@/lib/server/boundary/azure/products-client'
import usersClient from '@/lib/server/boundary/azure/users-client'

export async function withAzureDataAccess<R>(
  func: (dataAccess: DataAccessFacade) => Promise<R>,
) {
  const azureClient: DataAccessFacade = {
    ...imagesClient,
    ...productsClient,
    ...usersClient,
  }
  return func(azureClient)
}
