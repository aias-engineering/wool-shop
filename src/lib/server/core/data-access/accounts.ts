import { Account } from '../accounts'
import { ErrorInCosmosDbAccess } from '../failure'

export interface ReadAccountsByProviderAccount {
  readAccountsByProviderAccount(
    provider: string,
    providerAccountId: string,
  ): Promise<Account[] | ErrorInCosmosDbAccess>
}

export interface CreateAccountRequest {
  userId: string
  type: string
  provider: string
  providerAccountId: string
}

export interface CreateAccountResponse {
  id: string
}

export interface CreateAccount {
  createAccount(
    request: CreateAccountRequest,
  ): Promise<CreateAccountResponse | ErrorInCosmosDbAccess>
}
