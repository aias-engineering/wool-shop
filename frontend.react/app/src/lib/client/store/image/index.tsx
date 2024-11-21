import { PrimitiveAtom } from 'jotai'
import { atom } from 'jotai'
import { match, P } from 'ts-pattern'

export function toUrl(name: string) {
  return `/api/image/${name}`
}

export function toUrls(names: string[]) {
  return names.map((name) => toUrl(name))
}

export interface Image {
  url: string
}

export type ImagesFetch =
  | { step: 'fetching' }
  | { step: 'fetched'; data: PrimitiveAtom<Image>[] }
  | { step: 'error'; message: string }

export const imagesFetchAtom = atom<ImagesFetch>({ step: 'fetched', data: [] })

export const fetchImagesAction = atom(null, async (_, set) => {
  set(imagesFetchAtom, { step: 'fetching' })
  try {
    const response = await fetch('/api/image')
    if (response.ok) {
      const imagenames: string[] = await response.json()
      const data = toUrls(imagenames).map((url) => atom({ url }))
      set(imagesFetchAtom, { step: 'fetched', data })
    } else {
      set(imagesFetchAtom, { step: 'error', message: response.statusText })
    }
  } catch (error) {
    match(error).with(P.instanceOf(TypeError), (error) => {
      set(imagesFetchAtom, { step: 'error', message: error.message })
    })
  }
})

export type ImageDelete =
  | { imageAtom: PrimitiveAtom<Image>; step: 'idle' }
  | { imageAtom: PrimitiveAtom<Image>; step: 'deleting' }
  | { imageAtom: PrimitiveAtom<Image>; step: 'error'; message: string }

export const deleteImageAction = atom(
  null,
  async (get, set, toDelete: PrimitiveAtom<ImageDelete>) => {
    const imageUrl = get(get(toDelete).imageAtom).url
    set(toDelete, { ...get(toDelete), step: 'deleting' })
    try {
      const response = await fetch(imageUrl, { method: 'DELETE' })
      if (response.ok) {
        set(fetchImagesAction)
      } else {
        set(toDelete, {
          ...get(toDelete),
          step: 'error',
          message: response.statusText,
        })
      }
    } catch (error) {
      match(error).with(P.instanceOf(TypeError), (error) => {
        set(toDelete, {
          ...get(toDelete),
          step: 'error',
          message: error.message,
        })
      })
    }
  },
)
