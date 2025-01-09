import { ErrorInCosmosDbAccess } from '../failure'
import { Unit } from '../types'
import { CreateWishlistRequest, Wishlist } from '../wishlists'

export interface ReadAllWishlists {
  readAllWishlists(): Promise<Wishlist[] | ErrorInCosmosDbAccess>
}

export interface CreateWishlist {
  createWishlist(
    request: CreateWishlistRequest,
  ): Promise<Unit | ErrorInCosmosDbAccess>
}
