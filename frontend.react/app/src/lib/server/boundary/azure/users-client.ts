import { Container } from '@azure/cosmos'
import { woolshopDatabase } from './cosmos-db-client'
import {
  ReadUser,
  ReadUserWithEmail,
  CreateUser,
  CreateUserRequest,
  CreateUserResponse,
} from '@/lib/server/core/data-access'
import { User } from '@/lib/server/core/users'
import { match, P } from 'ts-pattern'
import {
  ErrorInCosmosDbAccess,
  MultipleUsersWithEmailFound,
  UserWithEmailNotFound,
} from '@/lib/server/core/failure'
import { UserWithIdNotFound } from '../../core/users/failure'

function users(): Promise<Container> {
  return woolshopDatabase()
    .then((database) =>
      database.containers.createIfNotExists({
        id: 'users',
        partitionKey: '/id',
      }),
    )
    .then((response) => response.container)
}

const readUser = (
  id: string,
): Promise<User | UserWithIdNotFound | ErrorInCosmosDbAccess> =>
  users()
    .then((container) => container.item(id, id).read<User>())
    .then((response) => response.resource || UserWithIdNotFound(id))
    .catch((error) => ErrorInCosmosDbAccess(error))

const readUserWithEmail = (
  email: string,
): Promise<
  | User
  | UserWithEmailNotFound
  | MultipleUsersWithEmailFound
  | ErrorInCosmosDbAccess
> =>
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
    .catch((reason) => ErrorInCosmosDbAccess(reason))

const createUser = (
  request: CreateUserRequest,
): Promise<CreateUserResponse | ErrorInCosmosDbAccess> =>
  users()
    .then((container) => container.items.create({ email: request.email }))
    .then((response) => ({ id: response.item.id }))
    .catch((error) => ErrorInCosmosDbAccess(error))

const usersClient: ReadUser & ReadUserWithEmail & CreateUser = {
  readUser,
  readUserWithEmail,
  createUser,
}

export default usersClient
