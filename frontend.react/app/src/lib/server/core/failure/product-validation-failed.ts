import { Failure } from "./failure"

export interface ProductValidationFailed extends Failure {
  readonly code: 'cpr-01'
  readonly reason: 'Validation for the provided Product failed'
  readonly error: TypeError
}

export const ProductValidationFailed: (
  error: TypeError,
) => ProductValidationFailed = (error: TypeError) => ({
  type: 'failure',
  code: 'cpr-01',
  reason: 'Validation for the provided Product failed',
  error,
})

export function isProductValidationFailed(x: unknown): x is ProductValidationFailed {
  const failure = x as ProductValidationFailed
  return (
    failure.type === 'failure' &&
    failure.code === 'cpr-01' &&
    failure.reason === 'Validation for the provided Product failed' &&
    failure.error !== undefined
  )
}