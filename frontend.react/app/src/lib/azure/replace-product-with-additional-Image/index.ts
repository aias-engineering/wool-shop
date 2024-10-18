import { Container } from '@azure/cosmos'
import readProductById from "../read-product-by-id"

export default async function replaceProductWithAdditionalImage(container: Container, id: string, imageLink: string) {
  const product = await readProductById(container, id)

  if (!product)
    return;

  const imageLinks = product.imageLinks ?? []
  product.imageLinks = [...imageLinks, imageLink]
  
  container.item(id, id).replace(product)
}