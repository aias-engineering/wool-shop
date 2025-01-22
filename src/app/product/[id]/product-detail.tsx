'use client'

import Button from '@/app/components/atoms/button'
import ImageFrame from '@/app/components/atoms/image-frame'
import Paragraph from '@/app/components/atoms/paragraph'
import Title from '@/app/components/atoms/title'
import {
  getCurrency,
  getProductInfo,
  isProductInfo,
  Product,
} from '@/lib/server/core/products'
import Image from 'next/image'
import {
  addToLocaleWishlist,
  getLocalWishlist,
  removeFromLocaleWishlist,
  toWishlistProduct,
  wishlistContainerAtom,
} from '@/app/components/organism/shop/store'
import { Minus, MoveLeft, Plus, ScrollText } from 'lucide-react'
import { useAtom } from 'jotai'
import Link from 'next/link'
import Shop from '@/app/components/organism/shop'
import Space from '@/app/components/atoms/space'
import Small from '@/app/components/atoms/small'
import { useLocale, useTranslations } from 'next-intl'
import { isProductInfoNotPresent } from '@/lib/server/core/products/failure'
import { match, P } from 'ts-pattern'
import {
  Error,
  ErrorMessage,
  ErrorTitle,
} from '@/app/components/molecules/error'

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const locale = useLocale()
  const eitherProductInfoOrNone = getProductInfo(product, locale)

  const translations = useTranslations('shop')
  const [wishlistContainer, setWishlistContainer] = useAtom(
    wishlistContainerAtom,
  )
  const wishlist = getLocalWishlist(wishlistContainer, locale)
  const matchingWishlistItem = wishlist.find((x) => x.product.id === product.id)

  return (
    <Shop>
      <Link href={'/'}>
        <div className="flex gap-1 pb-4 items-center">
          <MoveLeft className="h-4" /> <Small>{translations('back')}</Small>
        </div>
      </Link>
      {match(eitherProductInfoOrNone)
        .with(P.when(isProductInfo), (productInfo) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:grid-rows-[50px_auto]">
              <Title className="md:col-start-2" type="h2">
                {productInfo.name}
              </Title>
              <ImageFrame className="md:row-start-1 md:row-span-2">
                <Image
                  src={product.image}
                  alt={productInfo.name}
                  sizes="(min-width: 1280px) 39rem, (min-width: 1024px) 23rem, 19rem"
                  width={200}
                  height={300}
                  className="w-full"
                />
              </ImageFrame>
              <div className="flex flex-col gap-4">
                <Paragraph>
                  {productInfo.price} {getCurrency(locale)}
                </Paragraph>
                <Paragraph className="whitespace-pre-line">
                  {productInfo.description}
                </Paragraph>
                {matchingWishlistItem ? (
                  <div className="flex flex-row">
                    <Button
                      onClick={() => () =>
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
            </div>
            <Space className="h-20" />
          </>
        ))
        .with(P.when(isProductInfoNotPresent), (failure) => (
          <Error>
            <ErrorTitle>{translations('no-product-info.title')}</ErrorTitle>
            <ErrorMessage>
              <div>{translations('no-product-info.message')}</div>
              <Small>{failure.code}</Small>
              <Small> {failure.reason}</Small>
            </ErrorMessage>
          </Error>
        ))
        .exhaustive()}
    </Shop>
  )
}
