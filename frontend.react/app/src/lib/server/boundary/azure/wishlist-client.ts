import { ReadAllWishlists } from '@/lib/server/core/data-access/wishlists'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { Wishlist } from '@/lib/server/core/wishlists'
import { Container } from '@azure/cosmos'
import { woolshopDatabase } from './cosmos-db-client'

function wishlists(): Promise<Container> {
  return woolshopDatabase()
    .then((database) =>
      database.containers.createIfNotExists({
        id: 'wishlists',
        partitionKey: '/id',
      }),
    )
    .then((response) => response.container)
}

const readAllWishlists = (): Promise<Wishlist[] | ErrorInCosmosDbAccess> =>
  wishlists()
    .then((container) => container.items.readAll<Wishlist>().fetchAll())
    .then((response) => response.resources)
    .catch((error) => ErrorInCosmosDbAccess(error))

const wishlistClient: ReadAllWishlists = {
  readAllWishlists,
}

export default wishlistClient
