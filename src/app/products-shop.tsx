'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import ImageFrame from '@/app/components/atoms/image-frame'
import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
import Space from '@/app/components/atoms/space'
import Title from '@/app/components/atoms/title'
import {
  getCurrency,
  getProductInfo,
  hasProductInfo,
  Product,
  ProductInfo,
} from '@/lib/server/core/products'
import Image from 'next/image'
import { Minus, Plus, ScrollText } from 'lucide-react'
import {
  addToLocaleWishlist,
  getLocalWishlist,
  removeFromLocaleWishlist,
  toWishlistProduct,
  wishlistContainerAtom,
} from '@/app/components/organism/shop/store'
import Link from 'next/link'
import { useAtom } from 'jotai'
import Shop from './components/organism/shop'
import { useLocale, useTranslations } from 'next-intl'
import { isProductInfoNotPresent } from '@/lib/server/core/products/failure'

interface Props {
  products: Product[]
}

export default function ProductsShop({ products }: Props) {
  const [wishlistContainer, setWishlistContainer] = useAtom(
    wishlistContainerAtom,
  )
  const locale = useLocale()
  const translations = useTranslations('home')

  return (
    <Shop>
      <Paragraph className="pb-4 whitespace-pre text-pretty">
        {translations('welcome')}
      </Paragraph>
      <Grid className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 min-w-[22rem]">
        {products
          .filter((product) => hasProductInfo(product, locale))
          .map((product) => {
            const either = getProductInfo(product, locale)
            if (isProductInfoNotPresent(either)) {
              // shouldn't happen
              return <></>
            }

            const productInfo: ProductInfo = either
            const wishlist = getLocalWishlist(wishlistContainer, locale)
            const matchingWishlistItem = wishlist.find(
              (x) => x.product.id === product.id,
            )
            return (
              <div
                key={product.id}
                className="flex flex-col gap-2 min-h-[24rem] md:h-[27rem] lg:h-[25rem] xl:h-[36rem]"
              >
                <Link href={`/product/${product.id}`}>
                  <ImageFrame className="h-[16rem] md:h-[19rem] lg:h-[17rem] xl:h-[29rem]">
                    <Image
                      src={product.image}
                      alt={productInfo.name}
                      sizes="(min-width:1280px) 310px, (min-width:640px) 304px, 172px"
                      width={200}
                      height={300}
                      className="sm:w-full"
                    />
                  </ImageFrame>
                </Link>
                <Title type="h3" className="text-sm h-10 overflow-hidden">
                  {productInfo.name}
                </Title>
                <Small className="text-end">
                  {productInfo.price.toFixed(2)} {getCurrency(locale)}
                </Small>
                {matchingWishlistItem ? (
                  <div className="flex flex-row">
                    <Button
                      onClick={() =>
                        setWishlistContainer((draft) =>
                          removeFromLocaleWishlist(draft, locale, product.id),
                        )
                      }
                      variant="counter"
                    >
                      <Minus />
                    </Button>
                    <div className="m-auto">{matchingWishlistItem.amount}</div>
                    <Button
                      onClick={() =>
                        setWishlistContainer((draft) =>
                          addToLocaleWishlist(
                            draft,
                            locale,
                            toWishlistProduct(
                              product.id,
                              productInfo.name,
                              productInfo.price,
                            ),
                          ),
                        )
                      }
                      variant="counter"
                    >
                      <Plus />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() =>
                      setWishlistContainer((draft) =>
                        addToLocaleWishlist(
                          draft,
                          locale,
                          toWishlistProduct(
                            product.id,
                            productInfo.name,
                            productInfo.price,
                          ),
                        ),
                      )
                    }
                  >
                    {translations('add-to-wishlist')}
                    <ScrollText />
                  </Button>
                )}
              </div>
            )
          })}
      </Grid>
      <Space className="h-20" />
    </Shop>
  )
}
