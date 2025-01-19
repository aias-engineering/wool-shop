import { Container } from '@azure/cosmos'
import { woolshopDatabase } from './cosmos-db-client'
import {
  CreateAccount,
  CreateAccountRequest,
  CreateAccountResponse,
} from '@/lib/server/core/data-access'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { Account } from '@/lib/server/core/accounts'
import { ReadAccountsByProviderAccount } from '../../core/data-access/accounts'

function accounts(): Promise<Container> {
  return woolshopDatabase()
    .then((database) =>
      database.containers.createIfNotExists({
        id: 'accounts',
        partitionKey: '/id',
      }),
    )
    .then((response) => response.container)
}

const readAccountsByProviderAccount = (
  provider: string,
  providerAccountId: string,
): Promise<Account[] | ErrorInCosmosDbAccess> =>
  accounts()
    .then((container) =>
      container.items
        .query({
          query:
            'SELECT * FROM Accounts a ' +
            'WHERE a.provider = @provider ' +
            '  AND a.providerAccountId = @providerAccountId',
          parameters: [
            { name: '@provider', value: provider },
            { name: '@providerAccountId', value: providerAccountId },
          ],
        })
        .fetchAll(),
    )
    .then((response) => response.resources as Account[])
    .catch((error) => ErrorInCosmosDbAccess(error))

const createAccount = (
  request: CreateAccountRequest,
): Promise<CreateAccountResponse | ErrorInCosmosDbAccess> =>
  accounts()
    .then((container) => container.items.create(request))
    .then((respone) => ({ id: respone.item.id }))
    .catch((error) => ErrorInCosmosDbAccess(error))

const accountsClient: CreateAccount & ReadAccountsByProviderAccount = {
  readAccountsByProviderAccount,
  createAccount,
}

export default accountsClient
