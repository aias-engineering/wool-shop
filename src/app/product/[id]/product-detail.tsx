'use client'

import Button from '@/app/components/atoms/button'
import ImageFrame from '@/app/components/atoms/image-frame'
import Paragraph from '@/app/components/atoms/paragraph'
import Title from '@/app/components/atoms/title'
import { Product } from '@/lib/server/core/products'
import Image from 'next/image'
import {
  addToWishlist,
  removeFromWishlist,
  wishlistAtom,
} from '@/app/components/organism/shop/store'
import { Minus, MoveLeft, Plus, ScrollText } from 'lucide-react'
import { useAtom } from 'jotai'
import Link from 'next/link'
import Shop from '@/app/components/organism/shop'
import Space from '@/app/components/atoms/space'
import Small from '@/app/components/atoms/small'

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const [wishlist, setWishlist] = useAtom(wishlistAtom)

  const matchingWishlistItem = wishlist.find((x) => x.product.id === product.id)

  return (
    <Shop wishlistAtom={wishlistAtom}>
      <Link href={'/'}>
        <div className="flex gap-1 pb-4 items-center">
          <MoveLeft className="h-4" /> <Small>Terug</Small>
        </div>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:grid-rows-[50px_auto]">
        <Title className="md:col-start-2" type="h2">
          {product.name}
        </Title>
        <ImageFrame className="md:row-start-1 md:row-span-2">
          <Image
            src={product.image}
            alt={product.name}
            sizes="(min-width: 1280px) 39rem, (min-width: 1024px) 23rem, 19rem"
            width={200}
            height={300}
            className="w-full"
          />
        </ImageFrame>
        <div className="flex flex-col gap-4">
          <Paragraph>{product.price} €</Paragraph>
          <Paragraph className="whitespace-pre-line">
            {product.description}
          </Paragraph>
          {matchingWishlistItem ? (
            <div className="flex flex-row">
              <Button
                onClick={() =>
                  setWishlist((prev) => removeFromWishlist(prev, product.id))
                }
                variant="counter"
              >
                <Minus />
              </Button>
              <div className="m-auto">{matchingWishlistItem.amount}</div>
              <Button
                onClick={() =>
                  setWishlist((prev) => addToWishlist(prev, product))
                }
                variant="counter"
              >
                <Plus />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() =>
                setWishlist((prev) => addToWishlist(prev, product))
              }
            >
              naar wensenlijst
              <ScrollText />
            </Button>
          )}
        </div>
      </div>
      <Space className="h-20" />
    </Shop>
  )
}
