import { Container } from '@azure/cosmos'
import { Product } from '../entities'

export default async function readAllProducts(container: Container) {
  const { resources } = await container.items.readAll<Product>().fetchAll()
  return resources;
}