'use client'

import Grid from '@/app/components/atoms/grid'
import { Product } from '@/lib/server/core/products'
import { useActionState, useState } from 'react'
import { match } from 'ts-pattern'
import { saveProductOnServer, SaveProductState } from './actions'
import Button from '@/app/components/atoms/button'
import Spinner from '@/app/components/atoms/spinner'
import {
  ImageCard,
  ImageCardState,
} from '@/app/components/molecules/image-card'
import {
  ProductInfoCard,
  ProductInfoState,
} from '@/app/components/molecules/product-info-card'
import { Save } from 'lucide-react'

interface Props {
  product: Product
}

export function EditProduct({ product }: Props) {
  const [imageCardState] = useState<ImageCardState>({
    state: 'uploaded',
    imageUrl: product.image,
  })
  const [nlProductInfoState] = useState<ProductInfoState>({
    state: 'preloaded',
    product,
  })
  const [enProductInfoState, setEnProductInfoState] =
    useState<ProductInfoState>(
      product.infoEn ? { state: 'preloaded', product } : 'hide',
    )
  const [saveProductState, formAction, pending] = useActionState(
    saveProductOnServer,
    'idle',
  )

  return (
    <form action={formAction}>
      <Grid className="grid-cols-1 xl:grid-cols-3 gap-2">
        <ImageCard imageCardState={imageCardState} pending={pending} />
        <ProductInfoCard
          name="infoNl"
          pending={pending}
          productInfoState={nlProductInfoState}
          title="Productinformatie in nederlands"
        >
          {enProductInfoState === 'hide' && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEnProductInfoState({ state: 'preloaded', product })
                }
                disabled={pending}
              >
                voeg Engelse info toe
              </Button>
              <SaveButton saveState={saveProductState} pending={pending} />
            </>
          )}
        </ProductInfoCard>
        <ProductInfoCard
          name="infoEn"
          pending={pending}
          productInfoState={enProductInfoState}
          title="Productinformatie in engels"
        >
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEnProductInfoState('hide')}
              disabled={pending}
            >
              annuleeren
            </Button>
            <SaveButton saveState={saveProductState} pending={pending} />
          </>
        </ProductInfoCard>
      </Grid>
    </form>
  )
}

interface SaveButtonProps {
  saveState: SaveProductState
  pending: boolean
}

function SaveButton({ saveState, pending }: SaveButtonProps) {
  return match(saveState)
    .with('idle', () => (
      <Button type="submit" disabled={pending}>
        {pending ? <Spinner /> : <Save />}
        Opslaan
      </Button>
    ))
    .with({ state: 'failure' }, ({ failure }) => (
      <div>
        {failure.code} {failure.reason}
      </div>
    ))
    .exhaustive()
}
