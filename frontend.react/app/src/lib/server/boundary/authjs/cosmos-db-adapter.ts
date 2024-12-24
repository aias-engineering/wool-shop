import { Adapter, AdapterAccount, AdapterSession, AdapterUser } from '@auth/core/adapters'
import * as users from '@/lib/server/core/users'
import * as accounts from '@/lib/server/core/accounts'
import { CreateAccountRequest, DataAccessFacade } from '@/lib/server/core/data-access'
import { isFailure, isUserWithEmailNotFound } from '../../core/failure'
import { isAccountWithProviderInfoNotFound } from '../../core/accounts/failure'

export const CosmosDbAdapter = (dataAccessProvider: () => Promise<DataAccessFacade>): Adapter => ({
  async createUser(user: AdapterUser) {
    const dataAccess = await dataAccessProvider()
    const response = await users.createUser(user.email, dataAccess)
    if (isFailure(response)) {
      throw response
    } else {
      return { ...user, id: response.id, email: response.email }
    }
  },
  async getUser(id: string) {
    const dataAccess = await dataAccessProvider()
    const either = await users.getUser(id, dataAccess)
    if (isFailure(either)) {
      throw either
    } else {
      const user = either
      return { id: user.id, email: user.email } as AdapterUser
    }
  },
  async getUserByEmail(email: string) {
    const dataAccess = await dataAccessProvider()
    const either = await users.getUserByEmail(email, dataAccess)

    if (users.isUser(either)){
      const user = either
      return { id: user.id, email: user.email } as AdapterUser
    } else if (isUserWithEmailNotFound(either)) {
      return null
    } else if (isFailure(either)) {
      throw either
    } else {
      return null
    }
  },
  async getUserByAccount({ provider, providerAccountId }) {
    const dataAccess = await dataAccessProvider()
    const either = await accounts.getAccountByProviderAccount(
      provider,
      providerAccountId,
      dataAccess,
    )
    if (isAccountWithProviderInfoNotFound(either)){
      return null
    } else if (accounts.isAccount(either)) {
      const account = either
      const eitherUser = await users.getUser(account.userId, dataAccess)
      if (isFailure(eitherUser)) {
        throw eitherUser
      } else {
        const user = eitherUser
        return { id: user.id, email: user.email } as AdapterUser
      }
    } else if (isFailure(either)) {
      throw either
    } else {
      return null
    }
  },
  async linkAccount(account: AdapterAccount) {
    const dataAccess = await dataAccessProvider()
    const request: CreateAccountRequest = {
      userId: account.userId,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId
     }
    const either = await accounts.createAccount(request, dataAccess)
    if (isFailure(either)) {
      throw either
    } else {
      const response = either
      return { ...account, id: response.id }
    }
  },
  async updateUser(user) {
    const dataAccess = await dataAccessProvider()
    const either = await users.getUser(user.id, dataAccess)
    if (isFailure(either)) {
      throw either
    } else {
      const user = either
      return { id: user.id, email: user.email } as AdapterUser
    }
  },
  async createSession(session) {
    return {} as AdapterSession
  },
  async getSessionAndUser(sessionToken) {
    return null
  },
  async updateSession(session) {
    return null
  },
  async deleteSession(sessionToken) {
    return
  }
})
