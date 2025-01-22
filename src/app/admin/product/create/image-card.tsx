import Button from '@/app/components/atoms/button'
import ImageUploadButton, {
  UploadedImage,
} from '@/app/components/atoms/image-upload-button'
import Input from '@/app/components/atoms/input'
import Title from '@/app/components/atoms/title'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/molecules/card'
import {
  Error,
  ErrorMessage,
  ErrorTitle,
} from '@/app/components/molecules/error'
import { Failure } from '@/lib/client/failure'
import { postImage } from '@/lib/client/post-image'
import { MightHaveClassName } from '@/lib/client/react'
import clsx from 'clsx'
import { MoveLeft } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { match, P } from 'ts-pattern'

export type ImageCardState =
  | 'idle'
  | { state: 'uploaded'; imageUrl: string }
  | { state: 'error'; failure: Failure }

interface Props extends MightHaveClassName {
  imageCardState: ImageCardState
  initialUploadDone?: () => void
  pending: boolean
}

export function ImageCard({
  className,
  imageCardState,
  initialUploadDone,
  pending,
}: Props) {
  const [state, setState] = useState<ImageCardState>(imageCardState)

  const handleImageUploaded = (image: UploadedImage) =>
    fetch(image.dataUrl)
      .then((response) => response.blob())
      .then((blob) => postImage({ data: blob, name: image.name }))
      .then((either) =>
        match(either)
          .with(P.string, (url) => {
            setState({ state: 'uploaded', imageUrl: url })
            if (initialUploadDone) initialUploadDone()
          })
          .otherwise((failure) => setState({ state: 'error', failure })),
      )

  return (
    <>
      {match(state)
        .with('idle', () => (
          <Card className={clsx(className)}>
            <CardHeader>
              <CardTitle>
                <Title type="h4">Een afbeelding kiezen</Title>
              </CardTitle>
              <CardDescription>
                In een eerste stap moeten we een afbeelding kiezen voor ons
                nieuwe product. Kies uit de volgende opties:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadButton
                onImageAtomUploaded={async () => {}}
                onImageUploaded={handleImageUploaded}
              />
            </CardContent>
          </Card>
        ))
        .with({ state: 'uploaded' }, ({ imageUrl }) => (
          <Card className={clsx(className)}>
            <CardHeader>
              <CardTitle>
                <Title type="h4">Product afbeelding</Title>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={imageUrl}
                alt={imageUrl}
                sizes="(min-width: 640px) 50vw, 100vw"
                width={200}
                height={300}
                className="w-full"
              />
              <Input type="hidden" name="image" value={imageUrl} required />
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setState('idle')}
                type="button"
                disabled={pending}
              >
                <MoveLeft />
                Kies een andere afbeelding
              </Button>
            </CardFooter>
          </Card>
        ))
        .with({ state: 'error' }, ({ failure }) => (
          <Card>
            <CardHeader>
              <CardTitle>
                <Title type="h4">Product afbeelding</Title>
              </CardTitle>
              <CardDescription>
                <Error>
                  <ErrorTitle>
                    <ErrorMessage>
                      {failure.code} {failure.reason}
                    </ErrorMessage>
                  </ErrorTitle>
                </Error>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadButton
                onImageAtomUploaded={async () => {}}
                onImageUploaded={handleImageUploaded}
              />
            </CardContent>
          </Card>
        ))
        .exhaustive()}
    </>
  )
}
