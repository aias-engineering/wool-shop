import { match } from 'ts-pattern'
import {
  CreateProduct,
  CreateProductResponse,
  ReadAllProducts,
  ReadProduct,
  DeleteProduct,
  CreateProductRequest,
} from '../data-access'
import { UpsertProduct } from '../data-access/products'
import {
  ErrorInCosmosDbAccess,
  ProductValidationFailed,
  ProductWithIdNotFound,
} from '../failure'
import { Unit } from '../types'
import { isProductInfoNotPresent, ProductInfoNotPresent } from './failure'
import { HasPrice } from '../wishlists'

export interface Product {
  id: string
  infoNl: ProductInfo
  infoEn?: ProductInfo
  image: string
}

export function isProduct(x: unknown): x is Product {
  const product = x as Product
  return (
    product.id !== undefined &&
    isProductInfo(product.infoNl) &&
    (product.infoEn === undefined || isProductInfo(product.infoEn)) &&
    product.image !== undefined
  )
}

export interface ProductInfo extends HasPrice {
  name: string
  description: string | null
}

export function isProductInfo(x: unknown): x is ProductInfo {
  const info = x as ProductInfo
  return (
    info !== undefined &&
    info.name !== undefined &&
    info.description !== undefined &&
    info.price !== undefined
  )
}

export const hasProductInfo = (product: Product, locale: string): boolean =>
  match(locale)
    .with('nl', () => true)
    .with('en', () => !!product.infoEn)
    .otherwise(() => false)

export const getProductInfo = (
  product: Product,
  locale: string,
): ProductInfo | ProductInfoNotPresent =>
  match(locale)
    .with('nl', () => product.infoNl)
    .with(
      'en',
      () => product.infoEn || ProductInfoNotPresent(product.id, locale),
    )
    .otherwise(() => ProductInfoNotPresent(product.id, locale))

export const getProductInfoOrDefault = (
  product: Product,
  locale: string,
): ProductInfo => {
  const either = getProductInfo(product, locale)
  if (isProductInfoNotPresent(either)) return product.infoNl
  else return either
}

export const getCurrency = (locale: string | undefined): string =>
  match(locale)
    .with('en', () => '$')
    .otherwise(() => '€')

export const getAllProducts = (
  dataAccess: ReadAllProducts,
): Promise<Product[] | ErrorInCosmosDbAccess> => dataAccess.readAllProducts()

export const getProduct = (
  id: string,
  dataAccess: ReadProduct,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  dataAccess.readProduct(id)

export const createProduct = async (
  request: CreateProductRequest,
  dataAccess: CreateProduct,
): Promise<
  CreateProductResponse | ProductValidationFailed | ErrorInCosmosDbAccess
> => dataAccess.createProduct(request)

export const deleteProduct = (
  id: string,
  dataAccess: DeleteProduct,
): Promise<Unit | ErrorInCosmosDbAccess> => dataAccess.deleteProduct(id)

export const saveProduct = (
  product: Product,
  dataAccess: UpsertProduct,
): Promise<Unit | ErrorInCosmosDbAccess> => dataAccess.upsertProduct(product)
