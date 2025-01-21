'use client'

import Button from '@/app/components/atoms/button'
import Input, { toId } from '@/app/components/atoms/input'
import Label from '@/app/components/atoms/label'
import Paragraph from '@/app/components/atoms/paragraph'
import { Separator } from '@/app/components/atoms/separator'
import Spinner from '@/app/components/atoms/spinner'
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
import { PrimitiveAtom, Provider, useAtom } from 'jotai'
import { ScrollText } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { saveWishlistOnServer, SaveWishlistState } from './server-actions'
import { match, P } from 'ts-pattern'
import { CreateWishlistRequest } from '@/lib/server/core/wishlists'
import {
  addToWishlist,
  removeFromWishlist,
  sumWishlist,
  WishlistItem,
} from './store'
import WishListItem from './wish-list-item'
import { HasChildren } from '@/lib/client/react'
import { useTranslations } from 'next-intl'

interface Props extends HasChildren {
  wishlistAtom: PrimitiveAtom<WishlistItem[]>
}

export default function Shop({ children, wishlistAtom }: Props) {
  const [email, setEmail] = useState('')
  const [wishlist, setWishlist] = useAtom(wishlistAtom)
  const [saveWishlistState, setSaveWishlistState] =
    useState<SaveWishlistState>('idle')
  const translations = useTranslations('shop')

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

    if (result === 'submitted') {
      setWishlist([])
    }
  }

  return (
    <Provider>
      <Sheet>
        {children}
        <div className="fixed bottom-1 left-0 grid px-2 w-full">
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="md:w-[40rem] lg:w-[48rem] xl:w-[80rem] mx-auto"
            >
              <ScrollText />
              {translations('wishlist')}
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="right" className="bg-white flex flex-col">
          <form onSubmit={handleSubmit}>
            <SheetHeader>
              <SheetTitle>{translations('wishlist')}</SheetTitle>
              <SheetDescription>{translations('description')}</SheetDescription>
            </SheetHeader>
            <div>
              {match(wishlist)
                .with([], () => (
                  <>
                    <Paragraph>{translations('wishlist-empty')}</Paragraph>
                    <SheetClose asChild>
                      <Button type="button" className="w-full">
                        {translations('browse-products')}
                      </Button>
                    </SheetClose>
                  </>
                ))
                .with(P.array(), (wishlist) => (
                  <>
                    {wishlist.map((item) => (
                      <WishListItem
                        key={item.product.id}
                        item={item}
                        add={() =>
                          setWishlist((prev) =>
                            addToWishlist(prev, item.product),
                          )
                        }
                        remove={() =>
                          setWishlist((prev) =>
                            removeFromWishlist(prev, item.product.id),
                          )
                        }
                      />
                    ))}
                    <Separator className="my-4" />
                    <Paragraph className="text-end">
                      {sumWishlist(wishlist).toFixed(2)} €
                    </Paragraph>
                  </>
                ))
                .exhaustive()}
            </div>
            <SheetFooter className="justify-self-end w-full pt-10">
              {match(wishlist)
                .with([], () => <></>)
                .with(P.array(), () => (
                  <>
                    {match(saveWishlistState)
                      .with(P.union('idle', 'pending'), (state) => (
                        <>
                          <Title type="h3">{translations('do-a-wish.title')}</Title>
                          <Paragraph>
                            {translations('do-a-wish.description')}
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
                                <Button type="submit">{translations('do-a-wish.save')}</Button>
                              ))
                              .with('pending', () => (
                                <Button type="submit" disabled>
                                  <Spinner />
                                  {translations('do-a-wish.title')}
                                </Button>
                              ))
                              .exhaustive()}
                          </div>
                        </>
                      ))
                      .with('submitted', () => (
                        <>
                          <Title type="h3">{translations('thank-you.title')}</Title>
                          <Paragraph>{translations('thank-you.description')}</Paragraph>
                          <SheetClose asChild>
                            <Button
                              type="button"
                              onClick={() => setSaveWishlistState('idle')}
                            >
                              {translations('thank-you.continue')}
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
