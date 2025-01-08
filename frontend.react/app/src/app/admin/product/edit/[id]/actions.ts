'use server'

import { ProductValidationFailed } from "@/lib/server/core/failure"
import { ProductFormSchema } from "./validation"

export type SaveProductState = 'idle'

export async function saveProductOnServer(
  prev: SaveProductState,
  formData: FormData,
): Promise<SaveProductState> {
  console.log(prev)
  console.log(formData)
  ProductFormSchema.safeParseAsync({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description') || null,
    price: formData.get('price'),
    image: formData.get('image'),
  })
  .then(result => result.success
    ? result.data
    : ProductValidationFailed(result.error)
  )
  .then(either => console.log('validation result: %o', either))
  return 'idle'
}
