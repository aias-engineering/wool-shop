import { Adapter, AdapterAccount, AdapterUser } from '@auth/core/adapters'
import * as users from '@/lib/server/core/users'
import * as accounts from '@/lib/server/core/accounts'
import { DataAccessFacade } from '@/lib/server/core/data-access'
import { isFailure } from '../../core/failure'

export const CosmosDbAdapter = (dataAccess: DataAccessFacade): Adapter => ({
  async createUser(user: AdapterUser) {
    const response = await users.createUser(user.email, dataAccess)
    if (isFailure(response)) {
      throw response
    } else {
      return { ...user, id: response.id, email: response.email }
    }
  },
  async getUser(id: string) {
    const either = await users.getUser(id, dataAccess)
    if (isFailure(either)) {
      throw either
    } else {
      const user = either
      return { id: user.id, email: user.email } as AdapterUser
    }
  },
  async getUserByAccount({ provider, providerAccountId }) {
    const either = await accounts.getAccountByProviderAccount(
      provider,
      providerAccountId,
      dataAccess,
    )
    if (isFailure(either)) {
      throw either
    } else {
      const account = either
      const eitherUser = await users.getUser(account.userId, dataAccess)
      if (isFailure(eitherUser)) {
        throw eitherUser
      } else {
        const user = eitherUser
        return { id: user.id, email: user.email } as AdapterUser
      }
    }
  },
  async linkAccount(account: AdapterAccount) {
    const either = await accounts.createAccount(account, dataAccess)
    if (isFailure(either)) {
      throw either
    } else {
      const response = either
      return { ...account, id: response.id }
    }
  },
})
