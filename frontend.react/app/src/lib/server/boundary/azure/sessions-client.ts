import { Container } from '@azure/cosmos'
import { woolshopDatabase } from './cosmos-db-client'
import {
  CreateSession,
  CreateSessionRequest,
  CreateSessionResponse,
} from '@/lib/server/core/data-access'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { Session } from '@/lib/server/core/sessions'
import {
  DeleteSession,
  ReadSessionsByToken,
} from '@/lib/server/core/data-access/sessions'
import { Unit } from '@/lib/server/core/types'

function sessions(): Promise<Container> {
  return woolshopDatabase()
    .then((database) =>
      database.containers.createIfNotExists({
        id: 'sessions',
        partitionKey: '/id',
      }),
    )
    .then((response) => response.container)
}

const createSession = (
  request: CreateSessionRequest,
): Promise<CreateSessionResponse | ErrorInCosmosDbAccess> =>
  sessions()
    .then((container) => container.items.create(request))
    .then((response) => ({ id: response.item.id }))
    .catch((error) => ErrorInCosmosDbAccess(error))

const readSessionsByToken = (
  sessionToken: string,
): Promise<Session[] | ErrorInCosmosDbAccess> =>
  sessions()
    .then((container) =>
      container.items
        .query({
          query:
            'SELECT * FROM Sessions s WHERE s.sessionToken = @sessionToken',
          parameters: [{ name: '@sessionToken', value: sessionToken }],
        })
        .fetchAll(),
    )
    .then((response) => response.resources as Session[])
    .catch((error) => ErrorInCosmosDbAccess(error))

const deleteSession = (id: string): Promise<Unit | ErrorInCosmosDbAccess> =>
  sessions()
    .then((container) => container.item(id, id).delete())
    .then(() => Unit.done)
    .catch((error) => ErrorInCosmosDbAccess(error))

const sessionsClient: CreateSession & ReadSessionsByToken & DeleteSession = {
  createSession,
  readSessionsByToken,
  deleteSession,
}

export default sessionsClient
