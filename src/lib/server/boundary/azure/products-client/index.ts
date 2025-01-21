import {
  ErrorInCosmosDbAccess,
  isErrorInCosmosDbAccess,
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
import { isAzureProductV1 } from './v1/types'
import azureProductV2Client, { toAzureCreateProductRequestV2 } from './v2'
import { isAzureProductV2 } from './v2/types'
import { Container } from '@azure/cosmos'
import { woolshopDatabase } from '../cosmos-db-client'
import { match, P } from 'ts-pattern'

async function products(): Promise<Container> {
  const database = await woolshopDatabase()
  const { container } = await database.containers.createIfNotExists({
    id: 'products',
    partitionKey: '/id',
  })
  return container
}

const toProducts = (resources: unknown[]): Product[] => 
  resources.map(toProduct).filter(x => x !== null)

const toProduct = (resource: unknown): Product | null => 
  match(resource)
    .with(P.when(isAzureProductV2), (product => (product as Product)))
    .with(P.when(isAzureProductV1), (product => ({
      id: product.id,
      infoNl: {
        name: product.name,
        description: product.description,
        price: product.price
      },
      infoEn: undefined,
      image: product.image
    } as Product)))
    .otherwise(() => (null))

const readAllProducts = (): Promise<ErrorInCosmosDbAccess | Product[]> =>
  products()
      .then((container) => container.items.readAll().fetchAll())
      .then(
        (response) => toProducts(response.resources),
        (error) => ErrorInCosmosDbAccess(error),
      )

const readProductsWithImage = (
  imagename: string,
): Promise<Product[] | ErrorInCosmosDbAccess> =>
  products()
      .then((container) =>
        container.items
          .query({
            query: 'SELECT * FROM Products p WHERE p.image = @imagename',
            parameters: [{ name: '@imagename', value: imagename }],
          })
          .fetchAll(),
      )
      .then((response) => toProducts(response.resources))
      .catch((err) => ErrorInCosmosDbAccess(err))

const readProduct = (
  id: string,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  products()
    .then((container) => container.item(id, id).read())
    .then((response) => toProduct(response.resource))
    .then(either => either !== null 
      ? either 
      : ProductWithIdNotFound(id))
    .catch((error) => ErrorInCosmosDbAccess(error))

const deleteProduct = (id: string): Promise<Unit | ErrorInCosmosDbAccess> =>
  products()
      .then((container) => container.item(id, id).delete())
      .then(() => Unit.done)
      .catch((error) => ErrorInCosmosDbAccess(error))

const createProduct = (
  request: CreateProductRequest,
): Promise<CreateProductResponse | ErrorInCosmosDbAccess> =>
  azureProductV2Client.createProduct(toAzureCreateProductRequestV2(request))
    .then(either => 
      isErrorInCosmosDbAccess(either)
        ? either
        : ({ id: either.id }) as CreateProductResponse
    )

const upsertProduct = (
  product: Product,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  azureProductV2Client.upsertProduct(product)

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
