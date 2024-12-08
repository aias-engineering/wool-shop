'use server'

import { withAzureDataAccess } from '@/lib/server'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { deleteProduct } from '@/lib/server/core/products'
import { Unit } from '@/lib/server/core/types'
import { revalidatePath } from 'next/cache'

export async function deleteProductAction(productId: string) {
  return withAzureDataAccess(async (dataAccess) =>
    deleteProduct(productId, dataAccess),
  ).then((either) => {
    if (either instanceof Unit) {
      revalidatePath('/admin/product')
      return {}
    } else if (either instanceof ErrorInCosmosDbAccess) {
      return {
        type: 'failure',
        code: either.code,
        reason: either.reason,
        error: either.error,
      }
    }
  })
}
