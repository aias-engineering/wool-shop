'use client'

import classNames from 'clsx'
import { Product } from "@/lib/azure/entities"
import { match, P } from 'ts-pattern'
import ImageOrPlaceholder from '../image'
import Button from '@/app/components/atoms/button'
import { useState } from 'react'
import OverlayContainer, { Overlay } from '@/app/components/atoms/overlay-container'
import { deleteProduct } from '@/app/admin/actions'

interface Props {
  className?: string,
  product: Product
}

const firstImage = (product: Product) => (
  match(product.imageLinks)
    .with([P.string], ([link]) => link)
    .otherwise(() => null))

const ProductsItem = ({className, product}: Props) => {
  const [hover, setHover] = useState<boolean>(false)

  const mouseOver = () => setHover(true)
  const mouseLeave = () => setHover(false)

  return (
    <>
      <div className={classNames('products__item', className)} 
           onMouseOver={mouseOver} 
           onMouseLeave={mouseLeave}>
        <OverlayContainer>
          <ImageOrPlaceholder src={firstImage(product)} alt={product.name} />
          { hover &&
              <Overlay>
                <Button onClick={() => deleteProduct(product.id)}>Delete</Button>
              </Overlay>
          }
        </OverlayContainer>
      </div>
    </>
  )
}

export default ProductsItem