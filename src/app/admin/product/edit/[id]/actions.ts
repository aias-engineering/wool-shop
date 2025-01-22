'use server'

import {
  Failure,
  isFailure,
  ProductValidationFailed,
} from '@/lib/server/core/failure'
import { isProduct, saveProduct } from '@/lib/server/core/products'
import { withAzureDataAccess } from '@/lib/server'
import { match, P } from 'ts-pattern'
import { isUnit } from '@/lib/server/core/types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { validateProduct } from '@/lib/server/core/products/validation'

export type SaveProductState = 'idle' | { state: 'failure'; failure: Failure }

export async function saveProductOnServer(
  prev: SaveProductState,
  formData: FormData,
): Promise<SaveProductState> {
  return validateProduct(formData)
    .then((either) =>
      either.success ? either.data : ProductValidationFailed(either.error),
    )
    .then(async (either) =>
      isProduct(either)
        ? withAzureDataAccess((dataAccess) => saveProduct(either, dataAccess))
        : either,
    )
    .then((either) =>
      match(either)
        .with(P.when(isUnit), () => {
          revalidatePath('')
          revalidatePath('/admin/product')
          revalidateTag('products')
          redirect('/admin/product')
          return 'idle' as SaveProductState
        })
        .with(P.when(isFailure), (failure) => {
          console.error('%o', failure)
          return { state: 'failure', failure } as SaveProductState
        })
        .exhaustive(),
    )
}
