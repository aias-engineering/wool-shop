'use server'

import { withAzureDataAccess } from '@/lib/server'
import { deleteProduct } from '@/lib/server/core/products'
import { isUnit } from '@/lib/server/core/types'
import { revalidatePath } from 'next/cache'

export async function deleteProductAction(productId: string) {
  return withAzureDataAccess(async (dataAccess) =>
    deleteProduct(productId, dataAccess),
  ).then((either) => {
    if (isUnit(either)) {
      revalidatePath('/admin/product')
      return either
    } else {
      return either
    }
  })
}
