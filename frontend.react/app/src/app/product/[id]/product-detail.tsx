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

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const [wishlist, setWishlist] = useAtom(wishlistAtom)

  const matchingWishlistItem = wishlist.find((x) => x.product.id === product.id)

  return (
    <Shop wishlistAtom={wishlistAtom}>
      <div className="flex flex-col gap-4">
        <Link href={'/'}>
          <MoveLeft /> Terug
        </Link>
        <Title type="h2">{product.name}</Title>
        <ImageFrame>
          <Image
            src={product.image}
            alt={product.name}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 66vw, 50vw"
            width={200}
            height={300}
            className="w-full"
          />
        </ImageFrame>
        <Paragraph>{product.price} €</Paragraph>
        <Paragraph>{product.description}</Paragraph>
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
            onClick={() => setWishlist((prev) => addToWishlist(prev, product))}
          >
            naar wensenlijst
            <ScrollText />
          </Button>
        )}
        <Space className="h-20" />
      </div>
    </Shop>
  )
}
