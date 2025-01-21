import {
  CreateProduct,
  CreateProductResponse,
  ReadAllProducts,
  ReadProduct,
  DeleteProduct,
  isCreateProductRequest,
} from '../data-access'
import { UpsertProduct } from '../data-access/products'
import {
  ErrorInCosmosDbAccess,
  ProductValidationFailed,
  ProductWithIdNotFound,
} from '../failure'
import { Unit } from '../types'
import { validateCreateProductRequest } from './validation'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string
}

export function isProduct(x: unknown): x is Product {
  const product = x as Product
  return (
    product.id !== undefined &&
    product.name !== undefined &&
    product.description !== undefined &&
    product.price !== undefined &&
    product.image !== undefined
  )
}

export interface ProductInfo {
  name: string
  description: string | null
  price: number
}

export function isProductInfo(x: unknown): x is ProductInfo {
  const info = x as ProductInfo
  return (
    info.name !== undefined &&
    info.description !== undefined &&
    info.price !== undefined
  )
}

export const getAllProducts = (
  dataAccess: ReadAllProducts,
): Promise<Product[] | ErrorInCosmosDbAccess> => dataAccess.readAllProducts()

export const getProduct = (
  id: string,
  dataAccess: ReadProduct,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  dataAccess.readProduct(id)

export const createProduct = async (
  formData: FormData,
  dataAccess: CreateProduct,
): Promise<
  CreateProductResponse | ProductValidationFailed | ErrorInCosmosDbAccess
> =>
  validateCreateProductRequest(formData)
    .then(either => 
      either.success 
        ? either.data
        : ProductValidationFailed(either.error)
    )
    .then(async either => 
      isCreateProductRequest(either)
        ? dataAccess.createProduct(either)
        : either
    )

export const deleteProduct = (
  id: string,
  dataAccess: DeleteProduct,
): Promise<Unit | ErrorInCosmosDbAccess> => dataAccess.deleteProduct(id)

export const saveProduct = (
  product: Product,
  dataAccess: UpsertProduct,
): Promise<Unit | ErrorInCosmosDbAccess> => dataAccess.upsertProduct(product)
