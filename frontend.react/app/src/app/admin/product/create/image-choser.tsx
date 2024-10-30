'use client'

import Button from "@/app/components/atoms/button";
import MainGrid from "@/app/components/grids/main";
import ImageOrPlaceholder from "@/app/components/atoms/image-or-placeholder";
import { match } from "ts-pattern";
import { atom, useAtom } from "jotai";

type State = 
  | { step: 'idle'}
  | { step: 'fetching' }
  | { step: 'fetched', imageNames: string[]}

const state = atom<State>({step: 'idle'})

export default function ImageChoser({}) {
  const [currentState, setState] = useAtom(state)

  async function handleAddButtonClick() : Promise<void> {
    await setState({step: 'fetching'})
    const response = await fetch('/api/image')
    await setState({step: 'fetched', imageNames: await response.json()})
  }

  return (
    <div>
      {match(currentState)
        .with({step: 'idle'}, () => (
          <Button onClick={handleAddButtonClick}>Add Image</Button>
        ))
        .with({step: 'fetching'}, () => (
          <div>
            fetching images...
          </div>
        ))
        .with({step: 'fetched'}, ({imageNames}) => (
          <MainGrid>
            {imageNames.map((name, index) => (
              <div key={index}>
                <ImageOrPlaceholder src={'/api/image/' + name} alt={name} />
              </div>
            ))}
          </MainGrid>
        ))
        .exhaustive()}
    </div>
  )
}