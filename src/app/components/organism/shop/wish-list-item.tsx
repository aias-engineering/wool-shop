'use client'

import Button from '@/app/components/atoms/button'
import Paragraph from '@/app/components/atoms/paragraph'
import Title from '@/app/components/atoms/title'
import { MightHaveClassName } from '@/lib/client/react'
import clsx from 'clsx'
import { Minus, Plus } from 'lucide-react'
import { WishlistItem, WishlistProduct } from './store'

export interface WishListItemProps extends MightHaveClassName {
  item: WishlistItem
  add: (product: WishlistProduct) => void
  remove: (productId: string) => void
}

export default function WishListItem({
  item,
  add,
  remove,
  className,
}: WishListItemProps) {
  const amount = item.amount

  return (
    <div className={clsx('flex flex-col gap-2 py-4', className)}>
      <Title type="h3">{item.product.name}</Title>
      <Paragraph className="text-end">{item.product.price} €</Paragraph>
      <div className="grid grid-cols-3">
        {amount > 0 ? (
          <Button
            type="button"
            onClick={() => remove(item.product.id)}
            variant="counter"
          >
            <Minus />
          </Button>
        ) : (
          <div></div>
        )}
        <div className="m-auto">{amount}</div>
        <Button
          type="button"
          onClick={() => add(item.product)}
          variant="counter"
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}
