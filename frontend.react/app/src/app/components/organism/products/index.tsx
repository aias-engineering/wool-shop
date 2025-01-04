'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import Image from '@/app/components/atoms/image'
import Input from '@/app/components/atoms/input'
import ImageFrame from '@/app/components/atoms/image-frame'
import { Separator } from '@/app/components/atoms/separator'
import Title from '@/app/components/atoms/title'
import {
  Sheet,
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
import { Github, Minus, Plus, ScrollText, X } from 'lucide-react'

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
      <Sheet>
        <Grid className="grid-cols-1 lg:grid-cols-4 gap-2">
          {products.map((product) => {
            const matchingWishlistItem = wishlist.find(x => x.product.id === product.id)
            return (
              <div key={product.id} className="flex flex-col gap-2">
                <ImageFrame>
                  <Image src={product.image} alt={product.name} />
                </ImageFrame>
                <Title type="h3">{product.name}</Title>
                <p>{product.price} €</p>
                { (matchingWishlistItem)
                    ? ( <div className='flex flex-row'>
                          <Button onClick={() => removeFromWishlist(product.id)} variant="counter">
                            <Minus />
                          </Button>
                          <div className="m-auto">{matchingWishlistItem.amount}</div>
                          <Button onClick={() => addToWishlist(product)} variant="counter">
                            <Plus />
                          </Button>
                        </div>)
                    : ( <Button onClick={() => addToWishlist(product)}>
                          naar wensenlijst
                          <ScrollText />
                        </Button>)
                }
                
              </div>
            )
          })}
        </Grid>
        <div className='fixed bottom-1 left-0 grid px-2 w-full'>
          <SheetTrigger asChild>
            <Button>
              <ScrollText />
              wensenlijst
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="right" className="bg-white w-full grid gap-4">
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
          <SheetFooter className='text-center justify-self-end'>
            <div>
              Laat ons weten wat uw wensen zijn. 
              Vul uw contactgegevens in en sla uw verlanglijstje op.
              Wij nemen contact met u op.
            </div>
            <form>
              <Input name='email' type='email' />
              <Button>Bewaar</Button>
            </form>
            <Separator />
            <div>
              Or sign in and save your wishlist in your profile.
              Wij nemen contact met u op.
            </div>
            <form>
              <Button>
                <Github />
                Sign In with Github
              </Button>  
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Provider>
  )
}
