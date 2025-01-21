export interface AzureProductV1 {
  id: string
  name: string
  description: string | null
  price: number
  image: string
}

export function isAzureProductV1(x: unknown): x is AzureProductV1 {
  const product = x as AzureProductV1
  return (
    product.id !== undefined &&
    product.name !== undefined &&
    product.description !== undefined &&
    product.price !== undefined &&
    product.image !== undefined
  )
}

export interface AzureCreateProductRequestV1 {
    readonly name: string,
    readonly description: string | null,
    readonly price: number,
    readonly image: string,
}

export function isAzureCreateProductRequestV1(x: unknown): x is AzureCreateProductRequestV1 {
  const request = x as AzureCreateProductRequestV1
  return (
    request.name !== undefined &&
    request.description !== undefined &&
    request.price !== undefined &&
    request.image !== undefined
  )
}

export interface AzureCreateProductResponseV1 {
  id: string
  request: AzureCreateProductRequestV1
}

export function isAzureCreateProductResponseV1(
  x: unknown,
): x is AzureCreateProductResponseV1 {
  const response = x as AzureCreateProductResponseV1
  return response.id !== undefined && isAzureCreateProductRequestV1(response.request)
}