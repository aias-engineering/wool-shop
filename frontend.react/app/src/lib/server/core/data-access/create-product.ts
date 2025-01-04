import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export interface CreateProduct {
  createProduct(
    request: CreateProductRequest,
  ): Promise<CreateProductResponse | ErrorInCosmosDbAccess>
}

export class CreateProductRequest {
  constructor(
    readonly name: string,
    readonly description: string | null,
    readonly price: number,
    readonly image: string,
  ) {}
}

export function isCreateProductRequest(x: unknown): x is CreateProductRequest {
  const request = x as CreateProductRequest
  return (
    request.name !== undefined &&
    request.description !== undefined &&
    request.price !== undefined &&
    request.image !== undefined
  )
}

export const CreateProductRequestFormSchema = z.object({
  name: zfd.text(z.string().min(1)),
  description: zfd.text(),
  price: zfd.numeric(z.number().gte(0)),
  image: zfd.text(z.string()),
})

export interface CreateProductResponse {
  id: string
  request: CreateProductRequest
}

export function isCreateProductResponse(x: unknown): x is CreateProductResponse {
  const response = x as CreateProductResponse
  return (
    response.id !== undefined &&
    isCreateProductRequest(response.request)
  )
}