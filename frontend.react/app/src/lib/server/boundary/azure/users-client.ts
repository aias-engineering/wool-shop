import { Container } from '@azure/cosmos'
import { woolshopDatabase } from './cosmos-db-client'
import { ReadUser } from '@/lib/server/core/data-access'
import { User } from '@/lib/server/core/types'
import { match, P } from 'ts-pattern'
import {
  ErrorInCosmosDbAccess,
  MultipleUsersWithEmailFound,
  UserWithEmailNotFound,
} from '@/lib/server/core/failure'

function users(): Promise<Container> {
  return woolshopDatabase()
    .then((database) =>
      database.containers.createIfNotExists({
        id: 'users',
        partitionKey: 'id',
      }),
    )
    .then((response) => response.container)
}

const client: ReadUser = {
  readUser: (email: string) =>
    users()
      .then((container) =>
        container.items
          .query({
            query: 'SELECT * FROM Users u WHERE u.email = @email',
            parameters: [{ name: '@email', value: email }],
          })
          .fetchAll(),
      )
      .then((response) => response.resources as User[])
      .then((users) =>
        match(users)
          .with([], () => UserWithEmailNotFound(email))
          .with([P.select()], (user) => user)
          .otherwise((users) =>
            MultipleUsersWithEmailFound(
              email,
              users.map((x) => x.id),
            ),
          ),
      )
      .catch((reason) => ErrorInCosmosDbAccess(reason)),
}

export default client
