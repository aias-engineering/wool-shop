import { Adapter, AdapterAccount, AdapterUser } from '@auth/core/adapters'
import * as accounts from '@/lib/server/core/accounts'
import { isAccountWithProviderInfoNotFound } from '@/lib/server/core/accounts/failure'
import {
  CreateAccountRequest,
  CreateSessionRequest,
  DataAccessFacade,
} from '@/lib/server/core/data-access'
import {
  isFailure,
  isUserWithEmailNotFound,
  isErrorInCosmosDbAccess,
} from '@/lib/server/core/failure'
import * as sessions from '@/lib/server/core/sessions'
import * as users from '@/lib/server/core/users'
import { isUserWithIdNotFound } from '@/lib/server/core/users/failure'
import { isSessionWithTokenNotFound } from '@/lib/server/core/sessions/failure'

const toAdapterUser = (user: users.User): AdapterUser => ({
  id: user.id,
  email: user.email,
  emailVerified: null,
})

export const CosmosDbAdapter = (
  dataAccessProvider: () => Promise<DataAccessFacade>,
): Adapter => ({
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
      return toAdapterUser(user)
    }
  },
  async getUserByEmail(email: string) {
    const dataAccess = await dataAccessProvider()
    const either = await users.getUserByEmail(email, dataAccess)

    if (users.isUser(either)) {
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
    if (isAccountWithProviderInfoNotFound(either)) {
      return null
    } else if (accounts.isAccount(either)) {
      const account = either
      const eitherUser = await users.getUser(account.userId, dataAccess)
      if (isFailure(eitherUser)) {
        throw eitherUser
      } else {
        const user = eitherUser
        return toAdapterUser(user)
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
      providerAccountId: account.providerAccountId,
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
      return toAdapterUser(user)
    }
  },
  async createSession(session) {
    const dataAccess = await dataAccessProvider()
    const request: CreateSessionRequest = {
      expires: session.expires,
      sessionToken: session.sessionToken,
      userId: session.userId,
    }
    const either = await sessions.createSession(request, dataAccess)

    if (isFailure(either)) {
      throw either
    } else {
      return session
    }
  },
  async getSessionAndUser(sessionToken) {
    const dataAccess = await dataAccessProvider()
    const eitherSession = await sessions.getSessionByToken(
      sessionToken,
      dataAccess,
    )

    if (sessions.isSession(eitherSession)) {
      const session = eitherSession
      const eitherUser = await users.getUser(session.userId, dataAccess)

      if (users.isUser(eitherUser)) {
        const user = eitherUser
        return {
          session: {
            expires: session.expires,
            sessionToken: session.sessionToken,
            userId: session.userId,
          },
          user: toAdapterUser(user),
        }
      } else if (isUserWithIdNotFound(eitherUser)) {
        return null
      } else {
        throw eitherSession
      }
    } else if (isSessionWithTokenNotFound(eitherSession)) {
      return null
    } else {
      throw eitherSession
    }
  },
  async updateSession(_session) {
    // just some code to fool lint
    if (_session.expires) return null
    else return null
  },
  async deleteSession(sessionToken) {
    const dataAccess = await dataAccessProvider()
    const result = await sessions.deleteSessionsByToken(
      sessionToken,
      dataAccess,
    )
    if (isErrorInCosmosDbAccess(result)) {
      throw result
    } else {
      return
    }
  },
})
