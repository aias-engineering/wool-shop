import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";
dotenv.config()

const cosmosClient = new CosmosClient({
  endpoint: 'https://tca0jxc3reuapiywm.documents.azure.com:443/', 
  key: process.env.WOOL_SHOP_COSMOSDB_KEY,
})

const database = cosmosClient.database('wool-shop')

export const getProducts = async () => {
  const {resources: itemDefList} = await database.container('products').items.readAll().fetchAll()
  return itemDefList
}