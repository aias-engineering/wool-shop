import { ErrorInCosmosDbAccess } from '../failure'
import { Wishlist } from '../wishlists'

export interface ReadAllWishlists {
  readAllWishlists(): Promise<Wishlist[] | ErrorInCosmosDbAccess>
}
