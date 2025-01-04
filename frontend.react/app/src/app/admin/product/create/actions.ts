'use server'

import { createProduct } from '@/lib/server/core/products'
import { withAzureDataAccess } from '@/lib/server'
import { match, P } from 'ts-pattern'
import { CreateProductResponse, isCreateProductResponse } from '@/lib/server/core/data-access'
import { ErrorInCosmosDbAccess, isErrorInCosmosDbAccess, isProductValidationFailed, ProductValidationFailed } from '@/lib/server/core/failure'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type CreateProductState =
  | { step: 'done', response: CreateProductResponse }
  | { step: 'validation-failure', failure: ProductValidationFailed }
  | { step: 'failure', failure: ErrorInCosmosDbAccess }

export async function createProductOnServer(formData: FormData): Promise<CreateProductState> {
  const result: CreateProductState = 
    await withAzureDataAccess(dataAccess => createProduct(formData, dataAccess))
      .then(either => match(either)
        .with(P.when(isCreateProductResponse), (response) => ({
          step: 'done',
          response
        } as CreateProductState))
        .with(P.when(isProductValidationFailed), (failure) => ({
          step: 'validation-failure',
          failure
        } as CreateProductState))
        .with(P.when(isErrorInCosmosDbAccess), (failure) => ({
          step: 'failure',
          failure
        } as CreateProductState))
        .exhaustive())

  if (result.step === 'done'){
    revalidatePath('/products')
    redirect('/admin/product')
  }

  return result
}
