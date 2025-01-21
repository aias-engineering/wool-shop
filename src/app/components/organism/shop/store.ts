import {
  calculateTotal,
} from '@/lib/server/core/wishlists'
import { withImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'
import { match } from 'ts-pattern'

export interface WishlistsContainer {
  nl: WishlistItem[]
  en: WishlistItem[]
}

export interface WishlistItem {
  amount: number
  product: WishlistProduct
}

export interface WishlistProduct {
  id: string
  name: string
  price: number
}

export const toWishlistProduct = (id: string, name: string, price: number) => ({
  id, name, price
})

export const wishlistContainerAtom = withImmer(
  atomWithStorage<WishlistsContainer>('wishlistContainer', { nl: [], en: [] }),
)

export const getLocalWishlist = (wishlists: WishlistsContainer, locale: string): WishlistItem[] =>
  match(locale)
    .with('en', () => wishlists.en)
    .otherwise(() => wishlists.nl)

export const setLocalWishlist = (prev: WishlistsContainer, locale: string, items: WishlistItem[]): void =>
  match(locale)
    .with('en', () => { prev.en = items })
    .otherwise(() => { prev.nl = items })

export const addToLocaleWishlist = (prev: WishlistsContainer, locale: string, product: WishlistProduct) => {
  const prevItems: WishlistItem[] = getLocalWishlist(prev, locale)
  const newItems: WishlistItem[] = addToWishlist(prevItems, product)
  setLocalWishlist(prev, locale, newItems)
}

export const removeFromLocaleWishlist = (prev: WishlistsContainer, locale: string, productId: string): WishlistsContainer => {
  const prevItems: WishlistItem[] = getLocalWishlist(prev, locale)
  setLocalWishlist(prev, locale, removeFromWishlist(prevItems, productId))
}

export function addToWishlist(
  prev: WishlistItem[],
  product: WishlistProduct,
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
  return calculateTotal(wishlist.map(item => ({amount: item.amount, price: item.product.price})))
}
