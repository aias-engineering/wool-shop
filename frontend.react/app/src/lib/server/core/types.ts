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

// product types
export interface Product {
  id: string
  name: string
  descripiton: string | null
  price: string
  image: string
}
