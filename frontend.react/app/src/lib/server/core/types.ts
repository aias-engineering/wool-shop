// overall types

export type SuccessResult = { state: 'success' }

export type FailureResult = { state: 'failure', message: string }

export type NotFoundResult = { state: 'not-found' }

// images types
export type ListImagesResult = 
  | SuccessResult & { imagenames: string[] }
  | FailureResult

export type DonwloadImageResult =
  | SuccessResult & { imageStream: ReadableStream }
  | FailureResult
  | NotFoundResult

export type UploadImageResult = SuccessResult | FailureResult

export type DeleteImageBlobResult = SuccessResult | FailureResult

// product types
export interface Product {
  id: string,
  name: string,
  descripiton: string | null,
  price: string,
  image: string
}

export type ReadProductsResult = 
  | SuccessResult & { products: Product[] }
  | FailureResult

// core types
export type DeleteImageResult =
  | SuccessResult
  | { state: 'referenced-by-products', products: Product[] }
  | FailureResult