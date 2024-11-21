import { CosmosClient } from '@azure/cosmos'
import dotenv from 'dotenv'
dotenv.config()

const cosmosClient = new CosmosClient({
  endpoint: 'https://tca0jxc3reuapiywm.documents.azure.com:443/',
  key: process.env.WOOL_SHOP_COSMOSDB_KEY,
})

export async function products() {
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: 'wool-shop',
  })
  const { container } = await database.containers.createIfNotExists({
    id: 'products',
    partitionKey: 'id',
  })
  return container
}
