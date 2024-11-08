'use client'

import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import Button from "@/app/components/atoms/button"
import Grid from "@/app/components/atoms/grid"
import Image from "@/app/components/atoms/image"
import { ImageIcon, MoveLeft } from "lucide-react"
import { useState } from "react"
import { match } from "ts-pattern"
import Space from "@/app/components/atoms/space"
import Input from "@/app/components/atoms/input"
import ImageFrame from "@/app/components/atoms/image-frame"
import ImageUploadButton, { UploadedImage } from "@/app/components/atoms/image-upload-button"
import { atom, useAtom } from "jotai"
import { ImagePostState, postImageAction } from "@/lib/client/store/image/post"
import { toUrl } from "@/lib/client/store/image"
import Spinner from "@/app/components/atoms/spinner"

interface Props {
  urls: string[]
}

type State = 
  | { step: 'idle', urls: string[] }
  | { step: 'choose', urls: string[] }
  | { step: 'chosen', urls: string[], chosenUrl: string }
  | { step: 'uploaded', urls: string[], imagePostState: ImagePostState }

const imagePostStateAtom = atom<ImagePostState>({step: 'idle'})

export default function PreloadedImagesChooser({urls}: Props) {
  const [state, setState] = useState<State>({step: 'idle', urls})
  const [imagePostState, setImagePostState] = useAtom(imagePostStateAtom)
  const [, uploadImage] = useAtom(postImageAction)

  async function handleImageUploaded(uploadedImage: UploadedImage) {
    await setState({ step: 'uploaded', urls, imagePostState })
    const response = await fetch(uploadedImage.dataUrl)
    const data = await response.blob()
    await uploadImage({ name: uploadedImage.name, data }, imagePostStateAtom)
  }

  return (
    <>
      {match(state)
        .with({step: 'idle'}, ({urls}) => (
          <>
            {urls.length > 0 &&
              <Button onClick={async () => setState({ step: 'choose', urls })}>
                <ImageIcon />
                een afbeelding kiezen
              </Button>
            }
            <ImageUploadButton onImageAtomUploaded={async() => {}} onImageUploaded={handleImageUploaded} />
          </>
        ))
        .with({ step: 'choose' }, ({urls}) => (
          <>
            <Button className="button--outline" onClick={async () => setState({step: 'idle', urls})}>
              <MoveLeft /> terug
            </Button>
            <Space className="space--top-1">
              <Grid className="grid--2-cols">
                {urls.map((url, index) => {
                    return (
                      <div key={index}>
                        <Button className="button--with-contents" onClick={async() => setState({step: 'chosen', urls, chosenUrl: url})}>
                          <AspectRatio ratio={3 / 4}>
                            <ImageFrame>
                              <Image className="image--with-zoom-effect" src={url} alt={url} />
                            </ImageFrame>
                          </AspectRatio>
                        </Button>
                      </div>
                    )
                  })}
              </Grid>
            </Space>
          </>
        ))
        .with({ step: 'chosen' }, ({chosenUrl}) => (
          <>
            <Button className="button--outline" onClick={async () => setState({step: 'choose', urls})}>
              <MoveLeft /> terug
            </Button>
            <Space className="space--top-1">
              <AspectRatio ratio={3 / 4}>
                <Image className="image--rounded" src={chosenUrl} alt={chosenUrl} />
              </AspectRatio>
              <Input type="hidden" name="image" value={chosenUrl} required />
            </Space>
          </>
        ))
        .with({ step: 'uploaded'}, ({}) => {

          async function backToIdle() {
            await setState({step: 'idle', urls})
            await setImagePostState({ step: 'idle' })
          }

          return (
            <>
              <Button className="button--outline" onClick={backToIdle}>
                <MoveLeft /> terug
              </Button>
              {match(imagePostState)
                .with({ step: 'idle' }, () => (<>idle</>))
                .with({ step: 'uploading' }, ({ image }) => (
                  <div>
                    <Spinner />
                    Uploading {image.name}...
                  </div>
                ))
                .with({ step: 'done' }, ({ image }) => (
                  <>
                    <Space className="space--top-1">
                      <AspectRatio ratio={3 / 4}>
                        <Image className="image--rounded" src={toUrl(image.name)} alt={toUrl(image.name)} />
                      </AspectRatio>
                      <Input type="hidden" name="image" value={toUrl(image.name)} required />
                    </Space>
                  </>
                ))
                .with({ step: 'error' }, ({ message }) => (
                  <>
                    {message}
                  </>
                ))
                .exhaustive()}
            </>
          )
        })
        .otherwise(() => (<>otherwise choser state</>))}
    </>
  )
}