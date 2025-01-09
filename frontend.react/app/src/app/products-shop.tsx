'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import ImageFrame from '@/app/components/atoms/image-frame'
import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
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

interface Props {
  products: Product[]
}

export default function ProductsShop({ products }: Props) {
  const [wishlist, setWishlist] = useAtom(wishlistAtom)

  return (
    <Shop wishlistAtom={wishlistAtom}>
      <Paragraph>
        Hoi <br />
        Wij zijn een kleine wolfabriek uit Jordanië. Je kunt hier niets
        bestellen, maar bekijk in ieder geval onze producten - en vertel ons
        over je wensen.
        <br />
        Dit zijn onze producten:
      </Paragraph>
      <Grid className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {products.map((product) => {
          const matchingWishlistItem = wishlist.find(
            (x) => x.product.id === product.id,
          )
          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
            >
              <div className="flex flex-col gap-2">
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
            </Link>
          )
        })}
      </Grid>
    </Shop>
  )
}
