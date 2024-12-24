import { Adapter, AdapterUser } from '@auth/core/adapters'
import * as users from '@/lib/server/core/users'
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
})
