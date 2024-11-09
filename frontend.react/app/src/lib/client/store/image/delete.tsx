import { atom, PrimitiveAtom } from "jotai"

export type ImageDeleteState =
  | { step: 'idle' }
  | { step: 'deleting', imageUrl: string }
  | { step: 'done', imageUrl: string }
  | { step: 'error', imageUrl: string, message: string }

export const deleteImageAction = 
  atom(null, async (_, set, imageUrl: string, reportToAtom: PrimitiveAtom<ImageDeleteState>) => {
    set(reportToAtom, { step: 'deleting', imageUrl })
    try {
      const response = await fetch(imageUrl, {
        method: 'DELETE'
      })
      if (response.ok) {
        set(reportToAtom, { step: 'done', imageUrl })
      } else {
        set(reportToAtom, { step: 'error', imageUrl, message: response.statusText })
      }
    } catch (error) {
      set(reportToAtom, { step: 'error', imageUrl, message: (error as TypeError)?.message })
    }
  })