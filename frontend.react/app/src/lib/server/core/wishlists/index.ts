import { ReadAllWishlists } from '../data-access/wishlists'
import { ErrorInCosmosDbAccess } from '../failure'

export interface WishlistItem {
  amount: number
  productId: string
  name: string
  price: number
}

export interface Wishlist {
  id: string
  email: string
  items: WishlistItem[]
  submitDate: Date
}

export function isWishlistItem(x: unknown): x is WishlistItem {
  const item = x as WishlistItem
  return (
    item.amount !== undefined &&
    item.productId !== undefined &&
    item.name !== undefined &&
    item.price !== undefined
  )
}

export function isWishlist(x: unknown): x is Wishlist {
  const wishlist = x as Wishlist
  return (
    wishlist.id !== undefined &&
    wishlist.email !== undefined &&
    wishlist.items !== undefined &&
    wishlist.items.every(isWishlistItem)
  )
}

export const getAllWishlists = (
  dataAccess: ReadAllWishlists,
): Promise<Wishlist[] | ErrorInCosmosDbAccess> => dataAccess.readAllWishlists()
