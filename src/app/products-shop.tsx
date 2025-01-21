'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import ImageFrame from '@/app/components/atoms/image-frame'
import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
import Space from '@/app/components/atoms/space'
import Title from '@/app/components/atoms/title'
import { getProductInfo, hasProductInfo, Product, ProductInfo } from '@/lib/server/core/products'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import {
  addToLocaleWishlist,
  getLocalWishlist,
  removeFromLocaleWishlist,
  toWishlistProduct,
  wishlistContainerAtom,
} from '@/app/components/organism/shop/store'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import Shop from './components/organism/shop'
import { useLocale, useTranslations } from 'next-intl'
import { isProductInfoNotPresent } from '@/lib/server/core/products/failure'

interface Props {
  products: Product[]
}

export default function ProductsShop({ products }: Props) {
  const wishlistContainer = useAtomValue(wishlistContainerAtom)
  const locale = useLocale()
  const translations = useTranslations('home')

  return (
    <Shop wishlistsContainerAtom={wishlistContainerAtom}>
      <Paragraph className="pb-4 whitespace-pre text-pretty">
        {translations('welcome')}
      </Paragraph>
      <Grid className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 min-w-[22rem]">
        {products
          .filter(product => hasProductInfo(product, locale))
          .map((product) => {
            const either = getProductInfo(product, locale)
            if (isProductInfoNotPresent(either)){
              // shouldn't happen
              return (<></>)
            }

          const productInfo: ProductInfo = either
          const wishlist = getLocalWishlist(wishlistContainer, locale)
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
                    alt={productInfo.name}
                    sizes="(min-width:1280px) 310px, 172px"
                    width={200}
                    height={300}
                    className="sm:w-full"
                  />
                </ImageFrame>
              </Link>
              <Title type="h3" className="text-base">
                {productInfo.name}
              </Title>
              <Small className="text-end">{productInfo.price} €</Small>
              {matchingWishlistItem ? (
                <div className="flex flex-row">
                  <Button
                    onClick={() =>
                      removeFromLocaleWishlist(wishlistContainer, locale, product.id)
                    }
                    variant="counter"
                  >
                    <Minus />
                  </Button>
                  <div className="m-auto">{matchingWishlistItem.amount}</div>
                  <Button
                    onClick={() =>
                      addToLocaleWishlist(wishlistContainer, locale, toWishlistProduct(product.id, productInfo.name, productInfo.price))
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
