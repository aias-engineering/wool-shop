import { DataAccessFacade } from './core/data-access'
import accountsClient from './boundary/azure/accounts-client'
import imagesClient from '@/lib/server/boundary/azure/images-client'
import productsClient from '@/lib/server/boundary/azure/products-client'
import usersClient from '@/lib/server/boundary/azure/users-client'

export async function withAzureDataAccess<R>(
  func: (dataAccess: DataAccessFacade) => Promise<R>,
) {
  const azureClient: DataAccessFacade = {
    ...accountsClient,
    ...imagesClient,
    ...productsClient,
    ...usersClient,
  }
  return func(azureClient)
}
