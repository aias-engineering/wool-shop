import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";
dotenv.config()

export interface IProduct {
  name: string,
  description: string | null,
  price: bigint,
}

export interface CreateProductRequest {
  name: string,
  description: string | null,
  price: string,
}

export interface CreateProductResponse {
  idOfCreated: string,
  request: CreateProductRequest
}

const cosmosClient = new CosmosClient({
  endpoint: 'https://tca0jxc3reuapiywm.documents.azure.com:443/', 
  key: process.env.WOOL_SHOP_COSMOSDB_KEY,
})

const database = cosmosClient.database('wool-shop')

export async function getProducts() {
  const { resources } = await database.container('products').items.readAll().fetchNext();
  return resources[0];
}

export async function createProduct(request: CreateProductRequest) {
  console.log('saving product %o', request);
  const result = await database.container('products').items.upsert(request);
  console.log(result.item.id);
  return { idOfCreated: result.item.id, request: request };
}

export async function addImageToProduct(productId: string, imageLink: string) {
  const result = await database.container('products').items
    .query({
      query: 'SELECT * FROM products p WHERE p.Id = @id', 
      parameters: [{ name: '@id', value: productId }]
    }).fetchNext();
  console.log("reuslt %o", result)
  const product = result.resources[0];
  console.log(product)
  product.images = [...product.images, imageLink]
}