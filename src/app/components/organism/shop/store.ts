import { calculateTotal } from '@/lib/server/core/wishlists'
import { WritableDraft } from 'immer'
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
  id,
  name,
  price,
})

export const wishlistContainerAtom = withImmer(
  atomWithStorage<WishlistsContainer>('wishlistContainer', { nl: [], en: [] }),
)

export const getLocalWishlist = (
  wishlists: WishlistsContainer,
  locale: string,
): WishlistItem[] =>
  match(locale)
    .with('en', () => wishlists.en)
    .otherwise(() => wishlists.nl)

export const setLocalWishlist = (
  draft: WritableDraft<WishlistsContainer>,
  locale: string,
  items: WishlistItem[],
): void =>
  match(locale)
    .with('en', () => {
      draft.en = items
    })
    .otherwise(() => {
      draft.nl = items
    })

export const addToLocaleWishlist = (
  draft: WritableDraft<WishlistsContainer>,
  locale: string,
  product: WishlistProduct,
): void => {
  match(locale)
    .with('en', () => addToWishlist(draft.en, product))
    .otherwise(() => addToWishlist(draft.nl, product))
}

export const removeFromLocaleWishlist = (
  draft: WritableDraft<WishlistsContainer>,
  locale: string,
  productId: string,
): void => {
  match(locale)
    .with('en', () => removeFromWishlist(draft.en, productId))
    .otherwise(() => removeFromWishlist(draft.nl, productId))
}

function addToWishlist(
  draft: WritableDraft<WishlistItem>[],
  product: WishlistProduct,
): void {
  const wishlistItem = draft.find((x) => x.product.id === product.id)
  if (wishlistItem) {
    wishlistItem.amount += 1
  } else {
    draft.push({ amount: 1, product })
  }
}

function removeFromWishlist(
  draft: WritableDraft<WishlistItem>[],
  productId: string,
): void {
  const index = draft.findIndex((item) => item.product.id === productId)
  if (index !== -1) {
    const wishlistItem = draft[index]
    if (wishlistItem.amount === 1) {
      draft.splice(index, 1)
    } else {
      wishlistItem.amount -= 1
    }
  }
}

export function sumWishlist(wishlist: WishlistItem[]) {
  return calculateTotal(
    wishlist.map((item) => ({
      amount: item.amount,
      price: item.product.price,
    })),
  )
}
