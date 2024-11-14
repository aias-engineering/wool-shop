import { products } from "./cosmos-db-client";
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure';
import { Product } from "@/lib/server/core/types";

export async function readAllProducts(): Promise<ErrorInCosmosDbAccess|Product[]> {
  try {
    const container = await products()
    const { resources } = await container.items.readAll<Product>().fetchAll()
    return resources;
  } catch (err) {
    return new ErrorInCosmosDbAccess(err as TypeError)
  }
}

export async function readProductsWithImage(imagename: string): Promise<Product[]> {
  const container = await products()
  const response = await container.items.query({
    query: "SELECT * FROM Products p WHERE p.image = @imagename",
    parameters: [{ name: '@imagename', value: imagename }]
  }).fetchAll()

  return response.resources
}