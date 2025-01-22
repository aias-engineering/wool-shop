'use client'

import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import Title from '@/app/components/atoms/title'
import { Save } from 'lucide-react'
import { useActionState, useState } from 'react'
import { match } from 'ts-pattern'
import { createProductOnServer, CreateProductState } from './actions'
import Spinner from '@/app/components/atoms/spinner'
import { ImageCard, ImageCardState } from './image-card'
import { ProductInfoCard, ProductInfoState } from './product-info-card'

interface Props {
  urls: string[]
}

export function CreateProductWizard({}: Props) {
  const [imageCardState] = useState<ImageCardState>('idle')
  const [nlProductInfoState, setNlProductInfoState] =
    useState<ProductInfoState>('hide')
  const [enProductInfoState, setEnProductInfoState] =
    useState<ProductInfoState>('hide')
  const [creationState, formAction, pending] = useActionState(
    createProductOnServer,
    { step: 'idle' },
  )

  return (
    <form action={formAction}>
      <Title type="h3" className="py-4">
        Een product creëren
      </Title>
      <Grid className="grid-rows-2 grid-cols-1 xl:grid-cols-2 gap-2">
        <ImageCard
          className="row-span-2"
          imageCardState={imageCardState}
          initialUploadDone={() => setNlProductInfoState('idle')}
          pending={pending}
        />
        <ProductInfoCard
          name="infoNl"
          title="Productinformatie in nederlands"
          productInfoState={nlProductInfoState}
          pending={pending}
        >
          {enProductInfoState === 'hide' && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEnProductInfoState('idle')}
                disabled={pending}
              >
                voeg Engelse info toe
              </Button>
              <SaveButton creationState={creationState} pending={pending} />
            </>
          )}
        </ProductInfoCard>
        <ProductInfoCard
          name="infoEn"
          title="Productinformatie in engels"
          productInfoState={enProductInfoState}
          pending={pending}
        >
          <SaveButton creationState={creationState} pending={pending} />
        </ProductInfoCard>
      </Grid>
    </form>
  )
}

interface SaveButtonProps {
  creationState: CreateProductState
  pending: boolean
}

function SaveButton({ creationState, pending }: SaveButtonProps) {
  return match(creationState)
    .with({ step: 'idle' }, () => (
      <Button type="submit" disabled={pending}>
        {pending ? <Spinner /> : <Save />}
        Opslaan
      </Button>
    ))
    .with({ step: 'failure' }, ({ failure }) => (
      <div>
        {failure.code} {failure.reason}
      </div>
    ))
    .with({ step: 'validation-failure' }, ({ failure }) => (
      <div>
        {failure.code} {failure.reason}
        {failure.error.message}
      </div>
    ))
    .with({ step: 'done' }, () => <div>done</div>)
    .exhaustive()
}
