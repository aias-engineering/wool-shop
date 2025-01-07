'use server'

export type SaveProductState = 'idle'

export async function saveProductOnServer(
  prev: SaveProductState,
  formData: FormData,
): Promise<SaveProductState> {
  console.log(prev)
  console.log(formData)
  return 'idle'
}
