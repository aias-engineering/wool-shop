import { match, P } from 'ts-pattern'
import {
  CreateAccount,
  CreateAccountRequest,
  CreateAccountResponse,
} from '../data-access'
import { ReadAccountsByProviderAccount } from '../data-access/accounts'
import { ErrorInCosmosDbAccess, isFailure } from '../failure'
import {
  AccountWithProviderInfoNotFound,
  MultipleAccountsWithProviderInfoFound,
} from './failure'

export interface Account {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
}

export function isAccount(x: unknown): x is Account {
  const account = x as Account
  return (
    account.id !== undefined &&
    account.type !== undefined &&
    account.userId !== undefined &&
    account.provider !== undefined
  )
}

export const getAccountByProviderAccount = (
  provider: string,
  providerAccountId: string,
  dataAccess: ReadAccountsByProviderAccount,
): Promise<
  | Account
  | AccountWithProviderInfoNotFound
  | MultipleAccountsWithProviderInfoFound
  | ErrorInCosmosDbAccess
> =>
  dataAccess
    .readAccountsByProviderAccount(provider, providerAccountId)
    .then((either) =>
      match(either)
        .with([], () =>
          AccountWithProviderInfoNotFound(provider, providerAccountId),
        )
        .with([P.when(isAccount)], ([account]) => account)
        .with([P.when(isAccount), ...P.array()], () =>
          MultipleAccountsWithProviderInfoFound(provider, providerAccountId),
        )
        .with(P.when(isFailure), (failure) => failure)
        .exhaustive(),
    )

export const createAccount = (
  createAccountRequest: CreateAccountRequest,
  dataAccess: CreateAccount,
): Promise<CreateAccountResponse | ErrorInCosmosDbAccess> =>
  dataAccess.createAccount(createAccountRequest)
