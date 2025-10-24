import { revalidatePath, revalidateTag } from 'next/cache'

export { type Product } from './products'

// overall types
export interface Unit {
  type: 'unit'
}

const done: Unit = { type: 'unit' }

export const Unit = {
  done,
}

export function isUnit(x: unknown): x is Unit {
  const failure = x as Unit
  return failure.type === 'unit'
}