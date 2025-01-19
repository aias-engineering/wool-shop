import { DataAccessFacade } from './core/data-access'
import accountsClient from './boundary/azure/accounts-client'
import imagesClient from '@/lib/server/boundary/imagekit/images-client'
import productsClient from '@/lib/server/boundary/azure/products-client'
import sessionsClient from './boundary/azure/sessions-client'
import usersClient from '@/lib/server/boundary/azure/users-client'
import wishlistClient from './boundary/azure/wishlist-client'

export async function withAzureDataAccess<R>(
  func: (dataAccess: DataAccessFacade) => Promise<R>,
) {
  const azureClient: DataAccessFacade = {
    ...accountsClient,
    ...imagesClient,
    ...productsClient,
    ...sessionsClient,
    ...usersClient,
    ...wishlistClient,
  }
  return func(azureClient)
}
