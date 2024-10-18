import { Container } from '@azure/cosmos'
import { Product } from '../entities'

export default async function readProductById(container: Container, id: string): Promise<Product | null> {
  const item = container.item(id, id)
  const itemResponse = await item.read<Product>()
  return itemResponse.resource ?? null;
}