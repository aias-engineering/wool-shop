import { type Failure } from '../failure'

export interface AccountWithProviderInfoNotFound extends Failure {
  readonly code: 'cac-01'
  readonly provider: string
  readonly providerAccountId: string
}

export const AccountWithProviderInfoNotFound = (
  provider: string,
  providerAccountId: string,
): AccountWithProviderInfoNotFound => ({
  type: 'failure',
  code: 'cac-01',
  reason: `The account with provider info { ${provider} , ${providerAccountId} } wasn't found in the Azure Cosmos DB`,
  provider,
  providerAccountId,
})

export function isAccountWithProviderInfoNotFound(
  x: unknown,
): x is AccountWithProviderInfoNotFound {
  const failure = x as AccountWithProviderInfoNotFound
  return (
    failure.type === 'failure' &&
    failure.code === 'cac-01' &&
    failure.reason !== undefined &&
    failure.provider !== undefined &&
    failure.providerAccountId !== undefined
  )
}

export interface MultipleAccountsWithProviderInfoFound extends Failure {
  readonly code: 'cac-02'
  readonly provider: string
  readonly providerAccountId: string
}

export const MultipleAccountsWithProviderInfoFound = (
  provider: string,
  providerAccountId: string,
): MultipleAccountsWithProviderInfoFound => ({
  type: 'failure',
  code: 'cac-02',
  reason: `Multiple accounts with provider info { ${provider} , ${providerAccountId} } found in the Azure Cosmos DB`,
  provider,
  providerAccountId,
})

export function isMultipleAccountsWithProviderInfoFound(
  x: unknown,
): x is MultipleAccountsWithProviderInfoFound {
  const failure = x as MultipleAccountsWithProviderInfoFound
  return (
    failure.type === 'failure' &&
    failure.code === 'cac-02' &&
    failure.reason !== undefined &&
    failure.provider !== undefined &&
    failure.providerAccountId !== undefined
  )
}
