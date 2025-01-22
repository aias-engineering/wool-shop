import { Failure, isFailure } from '../failure'

export interface ProductInfoNotPresent extends Failure {
  readonly code: 'cpr-05'
  readonly productId: string
  readonly locale: string
}

export const ProductInfoNotPresent = (
  productId: string,
  locale: string,
): ProductInfoNotPresent => ({
  type: 'failure',
  code: 'cpr-05',
  reason: `Couldn't find product info for ${locale} on product ${productId}`,
  productId,
  locale,
})

export const isProductInfoNotPresent = (
  x: unknown,
): x is ProductInfoNotPresent => {
  const failure = x as ProductInfoNotPresent
  return (
    isFailure(failure) &&
    failure.code === 'cpr-05' &&
    failure.reason !== undefined &&
    failure.productId !== undefined &&
    failure.locale !== undefined
  )
}
