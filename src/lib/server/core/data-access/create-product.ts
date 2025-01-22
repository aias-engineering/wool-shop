import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { ProductInfo, isProductInfo } from '../products'

export interface CreateProduct {
  createProduct(
    request: CreateProductRequest,
  ): Promise<CreateProductResponse | ErrorInCosmosDbAccess>
}

export interface CreateProductRequest {
  readonly infoNl: ProductInfo
  readonly infoEn?: ProductInfo
  readonly image: string
}

export function isCreateProductRequest(x: unknown): x is CreateProductRequest {
  const request = x as CreateProductRequest
  return (
    isProductInfo(request.infoNl) &&
    (request.infoEn === undefined || isProductInfo(request.infoEn)) &&
    request.image !== undefined
  )
}

export interface CreateProductResponse {
  id: string
}

export function isCreateProductResponse(
  x: unknown,
): x is CreateProductResponse {
  const response = x as CreateProductResponse
  return response.id !== undefined
}
