'use server'

import { Failure, isFailure, ProductValidationFailed } from "@/lib/server/core/failure"
import { ProductFormSchema } from "./validation"
import { isProduct, Product, saveProduct } from "@/lib/server/core/products"
import { withAzureDataAccess } from "@/lib/server"
import { match, P } from "ts-pattern"
import { isUnit } from "@/lib/server/core/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type SaveProductState = 'idle' | { state: 'failure', failure: Failure }

export async function saveProductOnServer(
  prev: SaveProductState,
  formData: FormData,
): Promise<SaveProductState> {
  return ProductFormSchema.safeParseAsync({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description') || null,
    price: formData.get('price'),
    image: formData.get('image'),
  })
  .then(result => result.success
    ? ({
      id: result.data.id,
      name: result.data.name,
      descripiton: result.data.description,
      price: result.data.price,
      image: result.data.image
    }) as Product
    : ProductValidationFailed(result.error)
  )
  .then(async (either) => isProduct(either)
    ? withAzureDataAccess(dataAccess => saveProduct(either, dataAccess))
    : either)
  .then(either => match(either)
    .with(P.when(isUnit), () => {
      revalidatePath('/products')
      redirect('/admin/product')
      return 'idle' as SaveProductState
    })
    .with(P.when(isFailure), (failure) => ({state: 'failure', failure} as SaveProductState))
    .exhaustive()
  )
}
