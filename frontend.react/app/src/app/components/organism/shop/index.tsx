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
import { addToWishlist, removeFromWishlist, WishlistItem } from './store'
import WishListItem from './wish-list-item'
import { HasChildren } from '@/lib/client/react'

interface Props extends HasChildren {
  wishlistAtom: PrimitiveAtom<WishlistItem[]>
}

export default function Shop({ children, wishlistAtom }: Props) {
  const [email, setEmail] = useState('')
  const [wishlist, setWishlist] = useAtom(wishlistAtom)
  const [saveWishlistState, setSaveWishlistState] =
    useState<SaveWishlistState>('idle')

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
            <Button variant="outline">
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
