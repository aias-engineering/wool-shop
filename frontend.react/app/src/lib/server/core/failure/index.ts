import { type Failure } from './failure'
export { type Failure, isFailure } from './failure'
export {
  EmailValidationFailed,
  isEmailValidationFailed,
} from './email-validation-failed'
export {
  UserWithEmailNotFound,
  isUserWithEmailNotFound,
} from './user-with-email-not-found'

export interface ImageReferencedByProducts extends Failure {
  readonly code: 'cim-01'
  readonly reason: 'The image was still referenced by products.'
  readonly productnames: string[]
}

export interface ProductValidationFailed extends Failure {
  readonly code: 'cpr-01'
  readonly reason: 'Validation for the provided Product failed'
  readonly error: TypeError
}

export interface ErrorInCosmosDbAccess extends Failure {
  readonly code: 'cdb-00'
  readonly reason: 'An Error was thrown when accessing Azure Cosmos DB'
  readonly error: TypeError
}

export interface ProductWithIdNotFound extends Failure {
  readonly code: 'cdb-01'
  readonly id: string
}

export interface ErrorInBlobStorageAccess extends Failure {
  readonly code: 'bls-00'
  readonly reason: 'An Error was thrown when accessing Azure Blob Storage'
  readonly error: TypeError
}

export interface DownloadDidntReturnStream extends Failure {
  readonly code: 'bls-01'
  readonly imagename: string
}

export interface MultipleUsersWithEmailFound extends Failure {
  readonly code: 'cdb-03'
  readonly email: string
  readonly userIds: string[]
}

export const ImageReferencedByProducts: (
  productnames: string[],
) => ImageReferencedByProducts = (productnames: string[]) => ({
  type: 'failure',
  code: 'cim-01',
  reason: 'The image was still referenced by products.',
  productnames,
})

export function isImageReferencedByProducts(
  x: unknown,
): x is ImageReferencedByProducts {
  const failure = x as ImageReferencedByProducts
  return (
    failure.type === 'failure' &&
    failure.code === 'cim-01' &&
    failure.reason === 'The image was still referenced by products.'
  )
}

export const ProductValidationFailed: (
  error: TypeError,
) => ProductValidationFailed = (error: TypeError) => ({
  type: 'failure',
  code: 'cpr-01',
  reason: 'Validation for the provided Product failed',
  error,
})

export const ErrorInCosmosDbAccess: (
  error: TypeError,
) => ErrorInCosmosDbAccess = (error: TypeError) => ({
  type: 'failure',
  code: 'cdb-00',
  reason: 'An Error was thrown when accessing Azure Cosmos DB',
  error,
})

export const ProductWithIdNotFound: (id: string) => ProductWithIdNotFound = (
  id: string,
) => ({
  type: 'failure',
  code: 'cdb-01',
  reason: `The product with id ${id} wasn't found in the Azure Cosmos DB`,
  id,
})

export function isProductWithIdNotFound(
  x: unknown,
): x is ProductWithIdNotFound {
  const failure = x as ProductWithIdNotFound
  return failure.type === 'failure' && failure.code === 'cdb-01'
}

export const ErrorInBlobStorageAccess: (
  error: TypeError,
) => ErrorInBlobStorageAccess = (error: TypeError) => ({
  type: 'failure',
  code: 'bls-00',
  reason: 'An Error was thrown when accessing Azure Blob Storage',
  error,
})

export const DownloadDidntReturnStream: (
  imagename: string,
) => DownloadDidntReturnStream = (imagename: string) => ({
  type: 'failure',
  code: 'bls-01',
  reason: `Azure Blob Storage didn't return a ReadStream when downloading ${imagename}`,
  imagename,
})

export const MultipleUsersWithEmailFound: (
  email: string,
  userIds: string[],
) => MultipleUsersWithEmailFound = (email: string, userIds: string[]) => ({
  type: 'failure',
  code: 'cdb-03',
  reason: `FATAL! The user with email ${email} was found ${userIds.length} times in the Azure Cosmos DB`,
  email,
  userIds,
})
