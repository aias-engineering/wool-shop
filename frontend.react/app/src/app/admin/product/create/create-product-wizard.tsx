'use client'

import { AspectRatio } from "@/app/components/atoms/aspect-ratio"
import Button from "@/app/components/atoms/button"
import Grid from "@/app/components/atoms/grid"
import Image from "@/app/components/atoms/image"
import ImageUploadButton, { UploadedImage } from "@/app/components/atoms/image-upload-button"
import Input, { toId } from "@/app/components/atoms/input"
import Label from "@/app/components/atoms/label"
import Textarea from "@/app/components/atoms/textarea"
import Title from "@/app/components/atoms/title"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/molecules/card"
import { postImage } from "@/lib/client/post-image"
import { Failure } from "@/lib/server/core/failure"
import { MoveLeft } from "lucide-react"
import { useActionState, useState } from "react"
import { match, P } from "ts-pattern"
import { createProductOnServer } from "./actions"

interface Props {
  urls: string[]
}

type WizardState = 
  | { step: 'idle' }
  | { step: 'image-uploaded', imageUrl: string }
  | { step: 'error', failure: Failure}

export function CreateProductWizard({}: Props) {
  const [state, setState] = useState<WizardState>({ step: 'idle' })
  const [creationState, formAction, pending] = useActionState(createProductOnServer, {step: 'idle'})

  const handleImageUploaded = (image: UploadedImage) => 
    fetch(image.dataUrl)
      .then(response => response.blob())
      .then(blob => postImage({data: blob, name: image.name}))
      .then(either => match(either)
        .with(P.string, (url) => setState({step: 'image-uploaded', imageUrl: url }))
        .otherwise((failure) => setState({step: 'error', failure}))
      )

  return (
    <form action={formAction}>
      <Grid className="grid-cols-1 gap-2">
        <Title type="h3">Een product creëren</Title>
        {match(state)
          .with({step: 'idle'}, ({}) => (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Title type="h4">Een afbeelding kiezen</Title>
                  </CardTitle>
                  <CardDescription>
                    In een eerste stap moeten we een afbeelding kiezen voor ons nieuwe product.
                    Kies uit de volgende opties:
                  </CardDescription>       
                </CardHeader>
                <CardContent>
                  <ImageUploadButton
                    onImageAtomUploaded={async () => {}}
                    onImageUploaded={handleImageUploaded}
                    />
                </CardContent>
              </Card>
            </>
          ))
          .with({step: 'image-uploaded'}, ({imageUrl}) => (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Title type="h4">Product afbeelding</Title>
                  </CardTitle>       
                </CardHeader>
                <CardContent>
                  <AspectRatio ratio={1/1}>
                    <Image
                      className="image--rounded"
                      src={imageUrl}
                      alt={imageUrl}
                      width={300}
                      height={300}
                    />  
                  </AspectRatio>
                  <Input type="hidden" name="image" value={imageUrl} required />  
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setState({ step: 'idle' })} type="button" disabled={pending}>
                    <MoveLeft />
                    Kies een andere afbeelding
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Title type="h4">Productinformatie in nederlands</Title>
                  </CardTitle>       
                </CardHeader>
                <CardContent>
                  <Label htmlFor={toId('name')}>naam</Label>
                  <Input name="name" type="text" disabled={pending} required/>
                  <Label htmlFor={toId('description')}>beschrijving</Label>
                  <Textarea name="description" disabled={pending}></Textarea>
                  <Label htmlFor={toId('price')}>prijs in euro</Label>
                  <Input name="price" type="number" disabled={pending} required />
                </CardContent>
                <CardFooter>
                  {match(creationState)
                    .with({step: 'idle'}, () => (
                      <Button type="submit" disabled={pending}>
                        {'Product creëren'}
                      </Button>
                    ))
                    .with({step: 'failure'}, ({failure}) => (<div>{failure.code} {failure.reason}</div>))
                    .with({step: 'validation-failure'}, ({failure}) => (
                      <div>
                        {failure.code} {failure.reason}
                        {failure.error.message}
                      </div>
                    ))
                    .with({step: 'done'}, () => (<div>done</div>))
                    .exhaustive()
                  }
                </CardFooter>
              </Card>
            </>
          ))
          .with({step: 'error'}, ({failure}) => (
            <div>
              {failure.code} {failure.reason}
            </div>
          ))
          .exhaustive()}
      </Grid>
    </form>
  )
}