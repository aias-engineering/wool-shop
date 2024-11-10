import { CosmosClient } from "@azure/cosmos"
import dotenv from "dotenv";
import { Product, ReadProductsResult } from "@/lib/server/core/types";
dotenv.config()

const cosmosClient = new CosmosClient({
  endpoint: 'https://tca0jxc3reuapiywm.documents.azure.com:443/', 
  key: process.env.WOOL_SHOP_COSMOSDB_KEY,
})

async function products() {
  const { database } = await cosmosClient.databases.createIfNotExists({ id: 'wool-shop'})
  const { container } = await database.containers.createIfNotExists({ id: 'products', partitionKey: 'id' })
  return container
}

export async function readAllProducts(): Promise<ReadProductsResult> {
  try {
    const container = await products()
    const { resources } = await container.items.readAll<Product>().fetchAll()
    return { state: 'success', products: resources };
  } catch (err) {
    return {state: 'failure', message: (err as TypeError)?.message }
  }
}

export async function readProductsWithImage(imagename: string): Promise<ReadProductsResult> {
  try {
    const container = await products()
    const response = await container.items.query({
      query: "SELECT * FROM Products p WHERE p.image = @imagename",
      parameters: [{ name: '@imagename', value: imagename }]
    }).fetchAll()

    return { state: 'success', products: response.resources }
  } catch(err) {
    return { state: 'failure', message: (err as TypeError)?.message }
  }
}