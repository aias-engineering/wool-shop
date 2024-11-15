import { CosmosClient } from '@azure/cosmos'
import dotenv from 'dotenv'
import { Product } from './entities'
import readAllProducts from './read-all-products'
import readProductById from './read-product-by-id'
import replaceProductWithAdditionalImage from './replace-product-with-additional-Image'
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

export async function getProducts(): Promise<Product[]> {
  const productsContainer = await products()
  return await readAllProducts(productsContainer)
}

export async function getProduct(id: string): Promise<Product | null> {
  const productsContainer = await products()
  return await readProductById(productsContainer, id)
}

export async function createProduct(request: CreateProductRequest) {
  const productsContainer = await products()
  const result = await productsContainer.items.create(request)
  return { idOfCreated: result.item.id, request: request }
}

export async function addImageToProduct(id: string, imageLink: string) {
  const productContainer = await products()
  await replaceProductWithAdditionalImage(productContainer, id, imageLink)
}
