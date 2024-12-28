'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import Image from '@/app/components/atoms/image'
import ImageFrame from '@/app/components/atoms/image-frame'
import Title from '@/app/components/atoms/title'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/molecules/sheet'
import { MightHaveClassName } from '@/lib/client/react'
import { Product } from '@/lib/server/core/types'
import clsx from 'clsx'
import { Provider, useAtom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { Minus, Plus } from 'lucide-react'

interface WishlistItem {
  amount: number
  product: Product
}

const wishlistAtom = atomWithImmer<WishlistItem[]>([])

interface WishListItemProps extends MightHaveClassName {
  item: WishlistItem
  add: (product: Product) => void
  remove: (productId: string) => void
}

function WishListItem({ item, add, remove, className }: WishListItemProps) {
  const amount = item.amount

  return (
    <div className={clsx('flex flex-col gap-2 py-4', className)}>
      <Title type="h3">{item.product.name}</Title>
      <div className="grid grid-cols-3">
        {amount > 0 ? (
          <Button onClick={() => remove(item.product.id)} variant="counter">
            <Minus />
          </Button>
        ) : (
          <div></div>
        )}
        <div className="m-auto">{amount}</div>
        <Button onClick={() => add(item.product)} variant="counter">
          <Plus />
        </Button>
      </div>
    </div>
  )
}

interface Props {
  products: Product[]
}

export default function Products({ products }: Props) {
  const [wishlist, setWishlist] = useAtom(wishlistAtom)
  const addToWishlist = (product: Product) =>
    setWishlist((prev) => {
      const wishlistItem = prev.find((x) => x.product.id === product.id)
      if (wishlistItem) {
        wishlistItem.amount += 1
        return prev
      } else {
        return [...prev, { amount: 1, product }]
      }
    })

  const removeFromWishlist = (productId: string) =>
    setWishlist((prev) => {
      const wishlistItem = prev.find((item) => item.product.id === productId)
      if (wishlistItem) {
        if (wishlistItem.amount === 1) {
          return prev.filter((item) => item.product.id !== productId)
        } else {
          wishlistItem.amount -= 1
          return prev
        }
      }
    })

  return (
    <Provider>
      <Grid className="grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-2">
            <ImageFrame>
              <Image src={product.image} alt={product.name} />
            </ImageFrame>
            <Title type="h3">{product.name}</Title>
            <p>{product.price} €</p>
            <Sheet>
              <SheetTrigger asChild>
                <Button onClick={() => addToWishlist(product)}>
                  toevoegen aan wensenlijst
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white w-full gap-4">
                <SheetHeader>
                  <SheetTitle>wensenlijst</SheetTitle>
                  <SheetDescription>uw wensenlijst</SheetDescription>
                </SheetHeader>
                <div>
                  {wishlist.map((item) => (
                    <WishListItem
                      key={item.toString()}
                      item={item}
                      add={addToWishlist}
                      remove={removeFromWishlist}
                    />
                  ))}
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>bewaar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        ))}
      </Grid>
    </Provider>
  )
}
