import { CreateWishlist, ReadAllWishlists, ReadWishlist } from '../data-access/wishlists'
import { ErrorInCosmosDbAccess } from '../failure'
import { Unit } from '../types'
import { WishlistWithIdNotFound } from './failure'

export interface HasAmount {
  amount: number
}

export interface HasPrice {
  price: number
}

export interface WishlistItem extends HasAmount, HasPrice {
  productId: string
  name: string
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

export const getWishlist = (
  id: string,
  dataAccess: ReadWishlist
): Promise<Wishlist | WishlistWithIdNotFound | ErrorInCosmosDbAccess> => dataAccess.readWishlist(id)

export const createWithlist = (
  request: CreateWishlistRequest,
  dataAccess: CreateWishlist,
): Promise<Unit | ErrorInCosmosDbAccess> => dataAccess.createWishlist(request)

export interface CreateWishlistRequest {
  email: string
  items: WishlistItem[]
}

const roundResult = (result: number): number =>
  Math.round((result + Number.EPSILON) * 100) / 100

export const calculatePositionPrice = (position: HasAmount & HasPrice) => 
  roundResult(
    position.amount * position.price
  )

export const calculateTotal = (positions: (HasAmount & HasPrice)[]): number => 
  roundResult(
    positions.reduce(
      (sum, position) => sum + calculatePositionPrice(position), 0.0)
  )