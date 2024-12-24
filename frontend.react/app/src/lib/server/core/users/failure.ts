import { type Failure } from '../failure'

export interface UserWithIdNotFound extends Failure {
  readonly code: 'cur-01'
  readonly id: string
}

export const UserWithIdNotFound = (id: string): UserWithIdNotFound => ({
  type: 'failure',
  code: 'cur-01',
  reason: `The product with id ${id} wasn't found in the Azure Cosmos DB`,
  id,
})

export function isUserWithIdNotFound(x: unknown): x is UserWithIdNotFound {
  const failure = x as UserWithIdNotFound
  return (
    failure.type === 'failure' &&
    failure.code === 'cur-01' &&
    failure.reason !== undefined &&
    failure.id !== undefined
  )
}
