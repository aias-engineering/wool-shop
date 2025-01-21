import azureProductV1Client from './v1'
import {
  ErrorInCosmosDbAccess,
  ProductWithIdNotFound,
} from '@/lib/server/core/failure'
import { Product, Unit } from '@/lib/server/core/types'
import {
  DeleteProduct,
  ReadAllProducts,
  ReadProduct,
  ReadProductsWithImage,
  UpsertProduct,
} from '@/lib/server/core/data-access/products'
import {
  CreateProduct,
  CreateProductRequest,
  CreateProductResponse,
} from '@/lib/server/core/data-access'

const readAllProducts = (): Promise<ErrorInCosmosDbAccess | Product[]> =>
  azureProductV1Client.readAllProducts()

const readProductsWithImage = (
  imagename: string,
): Promise<Product[] | ErrorInCosmosDbAccess> =>
  azureProductV1Client.readProductsWithImage(imagename)

const readProduct = (
  id: string,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  azureProductV1Client.readProduct(id)

const deleteProduct = (id: string): Promise<Unit | ErrorInCosmosDbAccess> =>
  azureProductV1Client.deleteProduct(id)

const createProduct = (
  request: CreateProductRequest,
): Promise<CreateProductResponse | ErrorInCosmosDbAccess> =>
  azureProductV1Client.createProduct(request)

const upsertProduct = (
  product: Product,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  azureProductV1Client.upsertProduct(product)

const productClient: ReadProduct &
  ReadProductsWithImage &
  ReadAllProducts &
  DeleteProduct &
  CreateProduct &
  UpsertProduct = {
  readProduct,
  readProductsWithImage,
  readAllProducts,
  deleteProduct,
  createProduct,
  upsertProduct,
}

export default productClient
