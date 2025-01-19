import { Failure } from './failure'

export interface ErrorInCosmosDbAccess extends Failure {
  readonly code: 'cdb-00'
  readonly reason: 'An Error was thrown when accessing Azure Cosmos DB'
  readonly error: TypeError
}

export const ErrorInCosmosDbAccess: (
  error: TypeError,
) => ErrorInCosmosDbAccess = (error: TypeError) => ({
  type: 'failure',
  code: 'cdb-00',
  reason: 'An Error was thrown when accessing Azure Cosmos DB',
  error,
})

export function isErrorInCosmosDbAccess(
  x: unknown,
): x is ErrorInCosmosDbAccess {
  const failure = x as ErrorInCosmosDbAccess
  return (
    failure.type === 'failure' &&
    failure.code === 'cdb-00' &&
    failure.reason === 'An Error was thrown when accessing Azure Cosmos DB' &&
    failure.error !== undefined
  )
}
