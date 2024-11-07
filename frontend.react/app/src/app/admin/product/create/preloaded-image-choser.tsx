'use client'

import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import Button from "@/app/components/atoms/button"
import Grid from "@/app/components/atoms/grid"
import Image from "@/app/components/atoms/image"
import { ImageIcon, ImageUp, MoveLeft } from "lucide-react"
import { useState } from "react"
import { match } from "ts-pattern"
import Link from "next/link"
import Space from "@/app/components/atoms/space"
import Input from "@/app/components/atoms/input"
import ImageFrame from "@/app/components/atoms/image-frame"

interface Props {
  urls: string[]
}

type State = 
  | { step: 'idle', urls: string[] }
  | { step: 'choose', urls: string[] }
  | { step: 'chosen', urls: string[], chosenUrl: string }

export default function PreloadedImagesChooser({urls}: Props) {
  const [state, setState] = useState<State>({step: 'idle', urls})

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
            <Link href={'/admin/image'} className="button">
              <ImageUp /> 
              afbeelding uploaden
            </Link>
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
        .otherwise(() => (<></>))}
    </>
  )
}