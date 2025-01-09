import {
  CreateWishlist,
  ReadAllWishlists,
} from '@/lib/server/core/data-access/wishlists'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { CreateWishlistRequest, Wishlist } from '@/lib/server/core/wishlists'
import { Container } from '@azure/cosmos'
import { woolshopDatabase } from './cosmos-db-client'
import { Unit } from '../../core/types'

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

const createWishlist = (
  request: CreateWishlistRequest,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  wishlists()
    .then((container) => container.items.create(request))
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))

const wishlistClient: ReadAllWishlists & CreateWishlist = {
  readAllWishlists,
  createWishlist,
}

export default wishlistClient
