import { ErrorInCosmosDbAccess, ProductWithIdNotFound } from "../failure"
import { Product } from "../products"
import { Unit } from "../types"

export interface ReadAllProducts {
  readAllProducts(): Promise<Product[] | ErrorInCosmosDbAccess>
}

export interface ReadProductsWithImage {
  readProductsWithImage(
    imagename: string,
  ): Promise<Product[] | ErrorInCosmosDbAccess>
}

export interface ReadProduct {
  readProduct(
    id: string,
  ): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess>
}

export interface DeleteProduct {
  deleteProduct(id: string): Promise<Unit | ErrorInCosmosDbAccess>
}

export interface UpsertProduct {
  upsertProduct(product: Product): Promise<Unit | ErrorInCosmosDbAccess>
}