import { atom, PrimitiveAtom } from "jotai"

export interface PostableImage {
  name: string,
  data: Blob
}

export type ImagePostState =
  | { step: 'idle' }
  | { step: 'uploading', image: PostableImage }
  | { step: 'done', image: PostableImage }
  | { step: 'error', message: string }

export const postImageAction = atom(null, async (_, set, image: PostableImage,  reportToAtom: PrimitiveAtom<ImagePostState>) => {
  set(reportToAtom, {step: 'uploading', image })
  try {
    const response = await fetch(`/api/image/${(image.name)}`, {
      body: image.data,
      method: 'POST'
    })
    if (response.ok) {
      set(reportToAtom, { step: 'done', image })
    } else {
      set(reportToAtom, { step: 'error', message: response.statusText })
    }
  } catch (error) {
    set(reportToAtom, { step: 'error', message: (error as TypeError)?.message })
  }
})