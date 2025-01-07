'use client'

import CurrencyInput from '@/app/components/atoms/currency-input'
import Grid from '@/app/components/atoms/grid'
import ImageUploadButton, {
  UploadedImage,
} from '@/app/components/atoms/image-upload-button'
import Input, { toId } from '@/app/components/atoms/input'
import Title from '@/app/components/atoms/title'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/components/molecules/card'
import { Failure } from '@/lib/client/failure'
import { postImage } from '@/lib/client/post-image'
import { Product } from '@/lib/server/core/products'
import Image from 'next/image'
import { useActionState, useState } from 'react'
import { match, P } from 'ts-pattern'
import { saveProductOnServer } from './actions'
import Label from '@/app/components/atoms/label'
import Textarea from '@/app/components/atoms/textarea'
import Button from '@/app/components/atoms/button'
import Spinner from '@/app/components/atoms/spinner'
import { Save } from 'lucide-react'

interface Props {
  product: Product
}

type ImageUploadState =
  | { state: 'idle'; imageUrl: string }
  | { state: 'failure'; failure: Failure }

export function EditProduct({ product }: Props) {
  const [saveProductState, formAction, pending] = useActionState(
    saveProductOnServer,
    'idle',
  )
  const [imageUploadState, setImageUploadState] = useState<ImageUploadState>({
    state: 'idle',
    imageUrl: product.image,
  })

  const handleImageUploaded = (image: UploadedImage) =>
    fetch(image.dataUrl)
      .then((response) => response.blob())
      .then((blob) =>
        postImage({ data: blob, name: image.name }).then((either) =>
          match(either)
            .with(P.string, (url) =>
              setImageUploadState({ state: 'idle', imageUrl: url }),
            )
            .otherwise((failure) =>
              setImageUploadState({ state: 'failure', failure }),
            ),
        ),
      )

  return (
    <form action={formAction}>
      <Grid className="grid-cols-1 sm:grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <Title type="h4">Product afbeelding</Title>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {match(imageUploadState)
              .with({ state: 'idle' }, ({ imageUrl }) => (
                <>
                  <Image
                    src={imageUrl}
                    alt={imageUrl}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    width={200}
                    height={300}
                    className="w-full"
                    priority
                  />
                  <Input type="hidden" name="image" value={imageUrl} required />
                </>
              ))
              .with({ state: 'failure' }, ({ failure }) => (
                <div>
                  {failure.code} {failure.reason}
                </div>
              ))
              .exhaustive()}
          </CardContent>
          <CardFooter>
            <ImageUploadButton
              onImageAtomUploaded={async () => {}}
              onImageUploaded={handleImageUploaded}
            />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Title type="h4">Productinformatie in nederlands</Title>
          </CardHeader>
          <CardContent>
            <Label htmlFor={toId('id')}>id</Label>
            <Input
              name="id"
              type="text"
              defaultValue={product.id}
              disabled
              required
            />
            <Label htmlFor={toId('name')}>naam</Label>
            <Input
              name="name"
              type="text"
              disabled={pending}
              defaultValue={product.name}
              required
            />
            <Label htmlFor={toId('description')}>beschrijving</Label>
            <Textarea name="description" disabled={pending}></Textarea>
            <Label htmlFor={toId('price')}>prijs in euro</Label>
            <CurrencyInput name="price" defaultValue={product.price} />
          </CardContent>
          <CardFooter>
            {match(saveProductState)
              .with('idle', () => (
                <Button type="submit" disabled={pending}>
                  {pending ? <Spinner /> : <Save />}
                  Sparen
                </Button>
              ))
              .exhaustive()}
          </CardFooter>
        </Card>
      </Grid>
    </form>
  )
}
