export interface AzureProductV2 {
  id: string
  infoNl: AzureProductInfoV2
  infoEn?: AzureProductInfoV2
  image: string
}

export interface AzureProductInfoV2 {
  name: string
  description: string | null
  price: number
}

export function isAzureProductV2(x: unknown): x is AzureProductV2 {
  const product = x as AzureProductV2
  return (
    product.id !== undefined &&
    isAzureProductInfoV2(product.infoNl) &&
    (product.infoEn === undefined || isAzureProductInfoV2(product.infoEn)) &&
    product.image !== undefined
  )
}

export function isAzureProductInfoV2(x: unknown): x is AzureProductInfoV2 {
  const info = x as AzureProductInfoV2
  return (
    info !== undefined &&
    info.name !== undefined &&
    info.description !== undefined &&
    info.price !== undefined
  )
}

export interface AzureCreateProductRequestV2 {
  readonly infoNl: AzureProductInfoV2
  readonly infoEn?: AzureProductInfoV2
  readonly image: string,
}

export function isAzureCreateProductRequestV2(x: unknown): x is AzureCreateProductRequestV2 {
  const request = x as AzureCreateProductRequestV2
  return (
    isAzureProductInfoV2(request.infoNl) &&
    (request.infoEn === undefined || isAzureProductInfoV2(request.infoEn)) &&
    request.image !== undefined
  )
}

export interface AzureCreateProductResponseV2 {
  id: string
  request: AzureCreateProductRequestV2
}

export function isAzureCreateProductResponseV2(
  x: unknown,
): x is AzureCreateProductResponseV2 {
  const response = x as AzureCreateProductResponseV2
  return response.id !== undefined && isAzureCreateProductRequestV2(response.request)
}