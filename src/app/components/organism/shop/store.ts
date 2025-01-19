import { Product } from '@/lib/server/core/products'
import {
  calculateTotal,
  HasAmount,
  HasPrice,
} from '@/lib/server/core/wishlists'
import { withImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'

export interface WishlistItem {
  amount: number
  product: Product
}

export const wishlistAtom = withImmer(
  atomWithStorage<WishlistItem[]>('wishlist', []),
)

export function addToWishlist(
  prev: WishlistItem[],
  product: Product,
): WishlistItem[] {
  const wishlistItem = prev.find((x) => x.product.id === product.id)
  if (wishlistItem) {
    wishlistItem.amount += 1
    return prev
  } else {
    return [...prev, { amount: 1, product }]
  }
}

export function removeFromWishlist(
  prev: WishlistItem[],
  productId: string,
): WishlistItem[] {
  const wishlistItem = prev.find((item) => item.product.id === productId)
  if (wishlistItem) {
    if (wishlistItem.amount === 1) {
      return prev.filter((item) => item.product.id !== productId)
    } else {
      wishlistItem.amount -= 1
      return prev
    }
  }
  return prev
}

export function sumWishlist(wishlist: WishlistItem[]) {
  return calculateTotal(
    wishlist.map(
      (item) =>
        ({ amount: item.amount, price: item.product.price }) as HasAmount &
          HasPrice,
    ),
  )
}
