import { unstable_cache } from 'next/cache'
import {
  CreateProduct,
  CreateProductRequest,
  CreateProductResponse,
  CreateProductRequestFormSchema,
  ReadAllProducts,
  ReadProduct,
  DeleteProduct,
  isCreateProductResponse,
} from '../data-access'
import { UpsertProduct } from '../data-access/products'
import {
  ErrorInCosmosDbAccess,
  ProductValidationFailed,
  ProductWithIdNotFound,
} from '../failure'
import { isUnit, revalidateAndReturn, Unit } from '../types'

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

export const getAllProducts: (dataAccess: ReadAllProducts) => Promise<Product[] | ErrorInCosmosDbAccess> = 
  unstable_cache(
    (dataAccess) => dataAccess.readAllProducts(),
    ['products'],
    { revalidate: 60, tags: ['products'] }
  )

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
  CreateProductRequestFormSchema.safeParseAsync({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    image: formData.get('image'),
  })
    .then((result) =>
      result.success
        ? new CreateProductRequest(
            result.data.name,
            result.data.description,
            result.data.price,
            result.data.image,
          )
        : ProductValidationFailed(result.error),
    )
    .then(async (either) =>
      either instanceof CreateProductRequest
        ? await dataAccess.createProduct(either)
        : either,
    )
    .then(either => isCreateProductResponse(either)
      ? revalidateAndReturn('products', either)
      : either)

export const deleteProduct = (
  id: string,
  dataAccess: DeleteProduct,
): Promise<Unit | ErrorInCosmosDbAccess> => 
  dataAccess.deleteProduct(id)
    .then(either => isUnit(either)
      ? revalidateAndReturn('products', either)
      : either)

export const saveProduct = (
  product: Product,
  dataAccess: UpsertProduct,
): Promise<Unit | ErrorInCosmosDbAccess> => 
  dataAccess.upsertProduct(product)
    .then(either => isUnit(either)
      ? revalidateAndReturn('products', either)
      : either)
