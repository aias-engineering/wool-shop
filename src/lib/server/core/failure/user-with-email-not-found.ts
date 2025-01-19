import { type Failure } from './failure'

export interface UserWithEmailNotFound extends Failure {
  readonly code: 'cdb-02'
  readonly email: string
}

export const UserWithEmailNotFound: (email: string) => UserWithEmailNotFound = (
  email: string,
) => ({
  type: 'failure',
  code: 'cdb-02',
  reason: `The user with email ${email} wasn't found in the Azure Cosmos DB`,
  email,
})

export function isUserWithEmailNotFound(
  x: unknown,
): x is UserWithEmailNotFound {
  const failure = x as UserWithEmailNotFound
  return (
    failure.type === 'failure' &&
    failure.code === 'cdb-02' &&
    failure.email !== undefined &&
    failure.reason !== undefined
  )
}
