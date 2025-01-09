'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import NextImage from 'next/image'
import Input, { toId } from '@/app/components/atoms/input'
import ImageFrame from '@/app/components/atoms/image-frame'
import Label from '@/app/components/atoms/label'
import { Separator } from '@/app/components/atoms/separator'
import Small from '@/app/components/atoms/small'
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
import { isUnit, Product } from '@/lib/server/core/types'
import clsx from 'clsx'
import { Provider, useAtom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { Minus, Plus, ScrollText } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { saveWishlistOnServer, SaveWishlistState } from './actions'
import { match, P } from 'ts-pattern'
import Paragraph from './components/atoms/paragraph'
import { CreateWishlistRequest } from '@/lib/server/core/wishlists'
import Spinner from './components/atoms/spinner'

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
      <Paragraph className="text-end">{item.product.price} €</Paragraph>
      <div className="grid grid-cols-3">
        {amount > 0 ? (
          <Button
            type="button"
            onClick={() => remove(item.product.id)}
            variant="counter"
          >
            <Minus />
          </Button>
        ) : (
          <div></div>
        )}
        <div className="m-auto">{amount}</div>
        <Button
          type="button"
          onClick={() => add(item.product)}
          variant="counter"
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}

interface Props {
  products: Product[]
}

export default function ProductsShop({ products }: Props) {
  const [email, setEmail] = useState('')
  const [wishlist, setWishlist] = useAtom(wishlistAtom)
  const [saveWishlistState, setSaveWishlistState] =
    useState<SaveWishlistState>('idle')

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const request: CreateWishlistRequest = {
      email,
      items: wishlist.map((x) => ({
        amount: x.amount,
        productId: x.product.id,
        name: x.product.name,
        price: x.product.price,
      })),
    }
    setSaveWishlistState('pending')
    const result = await saveWishlistOnServer(saveWishlistState, request)
    setSaveWishlistState(result)

    if (isUnit(result)) {
      setWishlist([])
    }
  }

  return (
    <Provider>
      <Sheet>
        <Grid className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {products.map((product) => {
            const matchingWishlistItem = wishlist.find(
              (x) => x.product.id === product.id,
            )
            return (
              <div key={product.id} className="flex flex-col gap-2">
                <ImageFrame>
                  <NextImage
                    src={product.image}
                    alt={product.name}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 66vw, 50vw"
                    width={200}
                    height={300}
                    className="w-full"
                  />
                </ImageFrame>
                <Title type="h3" className="text-base">
                  {product.name}
                </Title>
                <Small className="text-end">{product.price} €</Small>
                {matchingWishlistItem ? (
                  <div className="flex flex-row">
                    <Button
                      onClick={() => removeFromWishlist(product.id)}
                      variant="counter"
                    >
                      <Minus />
                    </Button>
                    <div className="m-auto">{matchingWishlistItem.amount}</div>
                    <Button
                      onClick={() => addToWishlist(product)}
                      variant="counter"
                    >
                      <Plus />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => addToWishlist(product)}>
                    naar wensenlijst
                    <ScrollText />
                  </Button>
                )}
              </div>
            )
          })}
        </Grid>
        <div className="fixed bottom-1 left-0 grid px-2 w-full">
          <SheetTrigger asChild>
            <Button>
              <ScrollText />
              wensenlijst
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="right" className="bg-white w-full flex flex-col">
          <form onSubmit={handleSubmit}>
            <SheetHeader>
              <SheetTitle>wensenlijst</SheetTitle>
              <SheetDescription>uw wensenlijst</SheetDescription>
            </SheetHeader>
            <div>
              {match(wishlist)
                .with([], () => (
                  <>
                    <Paragraph>Je wensenlijstje is leeg</Paragraph>
                    <SheetClose asChild>
                      <Button type="button" className="w-full">
                        Bekijk onze producten
                      </Button>
                    </SheetClose>
                  </>
                ))
                .with(P.array(), (wishlist) => (
                  <>
                    {wishlist.map((item) => (
                      <WishListItem
                        key={item.toString()}
                        item={item}
                        add={addToWishlist}
                        remove={removeFromWishlist}
                      />
                    ))}
                  </>
                ))
                .exhaustive()}
            </div>
            <SheetFooter className="justify-self-end w-full">
              {match(wishlist)
                .with([], () => <></>)
                .with(P.array(), () => (
                  <>
                    <Separator className="my-4" />
                    {match(saveWishlistState)
                      .with(P.union('idle', 'pending'), (state) => (
                        <>
                          <Title type="h3">Doe een wens</Title>
                          <Paragraph>
                            Laat ons weten wat uw wensen zijn. Vul uw
                            contactgegevens in en sla uw verlanglijstje op. Wij
                            nemen contact met u op.
                          </Paragraph>
                          <div className="flex flex-col gap-4 pt-10">
                            <Label htmlFor={toId('email')}>email</Label>
                            <Input
                              name="email"
                              type="email"
                              defaultValue={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                            {match(state)
                              .with('idle', () => (
                                <Button type="submit">Opslaan</Button>
                              ))
                              .with('pending', () => (
                                <Button type="submit" disabled>
                                  <Spinner />
                                  Opslaan
                                </Button>
                              ))
                              .exhaustive()}
                          </div>
                        </>
                      ))
                      .with('submitted', () => (
                        <>
                          <Title type="h3">Dankejewel</Title>
                          <Paragraph>wij nemen contact met u op</Paragraph>
                          <SheetClose asChild>
                            <Button
                              type="button"
                              onClick={() => setSaveWishlistState('idle')}
                            >
                              Verder bladeren
                            </Button>
                          </SheetClose>
                        </>
                      ))
                      .with({ state: 'failure' }, ({ failure }) => (
                        <div>
                          {failure.code} {failure.reason}{' '}
                          {failure.error.message}
                        </div>
                      ))
                      .exhaustive()}
                  </>
                ))
                .exhaustive()}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </Provider>
  )
}
