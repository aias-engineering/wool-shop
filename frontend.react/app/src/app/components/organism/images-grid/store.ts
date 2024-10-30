import { atom, PrimitiveAtom } from "jotai"
import { match, P } from "ts-pattern";

export interface Image {
  url: string,
  state?: 
    | { step: 'deleting' }
    | { step: 'delete-failed', message: string }
}

export const imagesAtom = atom<PrimitiveAtom<Image>[]>([]);

export const deleteImageAction = atom(null, async (get, set, image: PrimitiveAtom<Image>) => {
  const imageUrlToDelete = get(image).url

  set(image, { ...get(image), state: { step: 'deleting' } })

  try {
    const response = await fetch(imageUrlToDelete, { method: 'DELETE' })

    if (response.ok) {
      set(imagesAtom, [...(get(imagesAtom).filter(x => get(x).url !== imageUrlToDelete))])

      set(fetchImagesAction)
    }
    else {
      set(image, { ...get(image), state: {step: 'delete-failed', message: response.statusText } })
    }
  }
  catch (error: unknown) {
      match(error)
        .with(P.instanceOf(TypeError), (error) => {
          set(image, { ...get(image), state: {step: 'delete-failed', message: error.message } })
        })
  }
})

export const fetchImagesAction = atom(null, async (_, set) => {
  const toUrl = (blobname: string) => `/api/image/${blobname}`
  const toUrls = (blobnames: string[]) => blobnames.map(name => toUrl(name))

  const response = await fetch('/api/image')
  const imagenames: string[] = await response.json()
  set(imagesAtom, toUrls(imagenames).map(url => atom({url})))
})
