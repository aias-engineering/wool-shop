'use server'

import { createProduct } from '@/lib/server/core/products'
import { withAzureDataAccess } from '@/lib/server'
import { match, P } from 'ts-pattern'
import {
  CreateProductResponse,
  isCreateProductRequest,
  isCreateProductResponse,
} from '@/lib/server/core/data-access'
import {
  ErrorInCosmosDbAccess,
  isErrorInCosmosDbAccess,
  isProductValidationFailed,
  ProductValidationFailed,
} from '@/lib/server/core/failure'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { validateCreateProductRequest } from '@/lib/server/core/products/validation'

export type CreateProductState =
  | { step: 'idle' }
  | { step: 'done', response: CreateProductResponse }
  | { step: 'validation-failure', failure: ProductValidationFailed }
  | { step: 'failure', failure: ErrorInCosmosDbAccess }

export const createProductOnServer = async (
  prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> => 
  validateCreateProductRequest(formData)
  .then(result => result.success
    ? result.data
    : ProductValidationFailed(result.error)
  )
  .then(either => isCreateProductRequest(either)
    ? withAzureDataAccess(dataAccess => createProduct(either, dataAccess))
    : either
  )
  .then((either) => match(either)
    .with(
      P.when(isCreateProductResponse),
      (response) => ({
        step: 'done',
        response,
      }) as CreateProductState
    )
    .with(
      P.when(isProductValidationFailed),
      (failure) => ({
        step: 'validation-failure',
        failure,
      }) as CreateProductState
    )
    .with(
      P.when(isErrorInCosmosDbAccess),
      (failure) => ({
        step: 'failure',
        failure,
      }) as CreateProductState
    )
    .exhaustive())
  .then(state => {
    if (state.step === 'done') {
      revalidatePath('')
      revalidatePath('/admin/product')
      revalidateTag('products')
      redirect('/admin/product')
    }
    return state
  })
