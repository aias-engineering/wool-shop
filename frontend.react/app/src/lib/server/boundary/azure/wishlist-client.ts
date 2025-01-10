import {
  CreateWishlist,
  ReadAllWishlists,
  ReadWishlist,
} from '@/lib/server/core/data-access/wishlists'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { Unit } from '@/lib/server/core/types'
import { CreateWishlistRequest, Wishlist } from '@/lib/server/core/wishlists'
import { WishlistWithIdNotFound } from '@/lib/server/core/wishlists/failure'
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

const readWishlist = (
  id: string,
): Promise<Wishlist | WishlistWithIdNotFound | ErrorInCosmosDbAccess> =>
  wishlists()
    .then((container) => container.item(id, id).read<Wishlist>())
    .then((response) => response.resource || WishlistWithIdNotFound(id))
    .catch((error) => ErrorInCosmosDbAccess(error))

const createWishlist = (
  request: CreateWishlistRequest,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  wishlists()
    .then((container) => container.items.create(request))
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))

const wishlistClient: ReadAllWishlists & ReadWishlist & CreateWishlist = {
  readAllWishlists,
  readWishlist,
  createWishlist,
}

export default wishlistClient
