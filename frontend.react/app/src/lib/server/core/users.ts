import { ReadUser } from './data-access'
import {
  UserWithEmailNotFound,
  MultipleUsersWithEmailFound,
  ErrorInCosmosDbAccess,
} from './failure'
import { EmailValidationFailed } from './failure/email-validation-failed'

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

export const getUser: (
  email: string,
  dataAccess: ReadUser,
) => Promise<
  | EmailValidationFailed
  | User
  | UserWithEmailNotFound
  | MultipleUsersWithEmailFound
  | ErrorInCosmosDbAccess
> = (email: string, dataAccess: ReadUser) => dataAccess.readUser(email)
