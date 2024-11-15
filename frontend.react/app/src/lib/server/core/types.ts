// overall types
export class Unit {
  static done = new Unit()
}

export type SuccessResult = { state: 'success' }

export type FailureResult = { state: 'failure'; message: string }

// images types
export type UploadImageResult = SuccessResult | FailureResult

// product types
export interface Product {
  id: string
  name: string
  descripiton: string | null
  price: string
  image: string
}

export type ReadProductsResult =
  | (SuccessResult & { products: Product[] })
  | FailureResult
