import { CosmosClient } from '@azure/cosmos'
import dotenv from 'dotenv'
dotenv.config()

export interface CreateProductRequest {
  name: string
  description: string | null
  price: string
  image: string
}

export interface CreateProductResponse {
  idOfCreated: string
  request: CreateProductRequest
}

const cosmosClient = new CosmosClient({
  endpoint: 'https://tca0jxc3reuapiywm.documents.azure.com:443/',
  key: process.env.WOOL_SHOP_COSMOSDB_KEY,
})

async function products() {
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: 'wool-shop',
  })
  const { container } = await database.containers.createIfNotExists({
    id: 'products',
    partitionKey: 'id',
  })
  return container
}

export async function createProduct(request: CreateProductRequest) {
  const productsContainer = await products()
  const result = await productsContainer.items.create(request)
  return { idOfCreated: result.item.id, request: request }
}
