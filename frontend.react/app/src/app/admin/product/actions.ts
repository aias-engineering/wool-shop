'use server'

import { withAzureDataAccess } from '@/lib/server'
import { deleteProduct } from '@/lib/server/core/products'
import { doAndReturn, isUnit } from '@/lib/server/core/types'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function deleteProductAction(productId: string) {
  return withAzureDataAccess(async (dataAccess) =>
    deleteProduct(productId, dataAccess),
  )
  .then(either => isUnit(either)
    ? doAndReturn(
      () => {
        revalidatePath('/')
        revalidatePath('/admin/product')
        revalidateTag('products')
      }, 
      either)
    : either)
}
