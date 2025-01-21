'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import ImageFrame from '@/app/components/atoms/image-frame'
import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
import Space from '@/app/components/atoms/space'
import Title from '@/app/components/atoms/title'
import { Product } from '@/lib/server/core/products'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import {
  addToWishlist,
  removeFromWishlist,
  wishlistAtom,
} from '@/app/components/organism/shop/store'
import Link from 'next/link'
import { useAtom } from 'jotai'
import Shop from './components/organism/shop'
import { useTranslations } from 'next-intl'

interface Props {
  products: Product[]
}

export default function ProductsShop({ products }: Props) {
  const [wishlist, setWishlist] = useAtom(wishlistAtom)
  const translations = useTranslations('home')

  return (
    <Shop wishlistAtom={wishlistAtom}>
      <Paragraph className="pb-4 whitespace-pre text-pretty">
        {translations('welcome')}
      </Paragraph>
      <Grid className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 min-w-[22rem]">
        {products.map((product) => {
          const matchingWishlistItem = wishlist.find(
            (x) => x.product.id === product.id,
          )
          return (
            <div
              key={product.id}
              className="flex flex-col gap-2 min-h-[24rem] md:h-[26rem] lg:h-[24rem] xl:h-[36rem]"
            >
              <Link href={`/product/${product.id}`}>
                <ImageFrame className="h-[16rem] md:h-[19rem] lg:h-[17rem] xl:h-[29rem]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    sizes="(min-width:1280px) 310px, 172px"
                    width={200}
                    height={300}
                    className="sm:w-full"
                  />
                </ImageFrame>
              </Link>
              <Title type="h3" className="text-base">
                {product.name}
              </Title>
              <Small className="text-end">{product.price} €</Small>
              {matchingWishlistItem ? (
                <div className="flex flex-row">
                  <Button
                    onClick={() =>
                      setWishlist((prev) =>
                        removeFromWishlist(prev, product.id),
                      )
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
                <div></div>
              )}
            </div>
          )
        })}
      </Grid>
      <Space className="h-20" />
    </Shop>
  )
}
