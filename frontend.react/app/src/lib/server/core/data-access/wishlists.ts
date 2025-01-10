import { ErrorInCosmosDbAccess } from '../failure'
import { Unit } from '../types'
import { CreateWishlistRequest, Wishlist } from '../wishlists'
import { WishlistWithIdNotFound } from '../wishlists/failure'

export interface ReadAllWishlists {
  readAllWishlists(): Promise<Wishlist[] | ErrorInCosmosDbAccess>
}

export interface ReadWishlist {
  readWishlist(id: string): Promise<Wishlist | WishlistWithIdNotFound | ErrorInCosmosDbAccess>
}

export interface CreateWishlist {
  createWishlist(
    request: CreateWishlistRequest,
  ): Promise<Unit | ErrorInCosmosDbAccess>
}
