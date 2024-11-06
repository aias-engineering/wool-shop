'use client'

import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import Button from "@/app/components/atoms/button"
import Grid from "@/app/components/atoms/grid"
import Image from "@/app/components/atoms/image"
import { ImageIcon, ImageUp } from "lucide-react"
import { useState } from "react"
import { match } from "ts-pattern"
import Link from "next/link"

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
            <Grid className="grid--2-cols">
              {urls.map((url, index) => {
                  return (
                    <div key={index}>
                      <Button className="button--with-contents" onClick={async() => setState({step: 'chosen', urls, chosenUrl: url})}>
                        <AspectRatio ratio={3 / 4}>
                          <Image className="image--rounded image--with-zoom-effect" src={url} alt={url} />
                        </AspectRatio>
                      </Button>
                    </div>
                  )
                })}
            </Grid>
          </>
        ))
        .with({ step: 'chosen' }, ({chosenUrl}) => (
          <>
            <AspectRatio ratio={3 / 4}>
              <Image className="image--rounded" src={chosenUrl} alt={chosenUrl} />
            </AspectRatio>
            <input type="hidden" name="image" value={chosenUrl} />
          </>
        ))
        .otherwise(() => (<></>))}
    </>
  )
}