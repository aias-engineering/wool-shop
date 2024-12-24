'use server'

import { createProduct } from '@/lib/server/core/products'
import { withAzureDataAccess } from '@/lib/server'

export async function handleCreateProductForm(formData: FormData) {
  return withAzureDataAccess((dataAccess) =>
    createProduct(formData, dataAccess),
  )
}
