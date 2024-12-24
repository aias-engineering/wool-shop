import { ReadUser, ReadUserWithEmail } from '../data-access'
import { CreateUser } from '../data-access/create-user'
import {
  EmailValidationFailed,
  ErrorInCosmosDbAccess,
  isFailure,
  MultipleUsersWithEmailFound,
  UserWithEmailNotFound,
} from '../failure'
import { UserWithIdNotFound } from './failure'

export interface User {
  id: string
  email: string
  password: string
}

export function isUser(x: unknown): x is User {
  const user = x as User
  return (
    user.id !== undefined &&
    user.email !== undefined &&
    user.password !== undefined
  )
}

export const getUser = (
  id: string,
  dataAccess: ReadUser,
): Promise<User | UserWithIdNotFound | ErrorInCosmosDbAccess> =>
  dataAccess.readUser(id)

export const getUserByEmail: (
  email: string,
  dataAccess: ReadUserWithEmail,
) => Promise<
  | EmailValidationFailed
  | User
  | UserWithEmailNotFound
  | MultipleUsersWithEmailFound
  | ErrorInCosmosDbAccess
> = (email: string, dataAccess: ReadUserWithEmail) =>
  dataAccess.readUserWithEmail(email)

export const createUser = (
  email: string,
  dataAccess: CreateUser,
): Promise<User | ErrorInCosmosDbAccess> =>
  dataAccess
    .createUser({ email })
    .then((either) =>
      isFailure(either)
        ? either
        : { id: either.id, email: email, password: 'any' },
    )
