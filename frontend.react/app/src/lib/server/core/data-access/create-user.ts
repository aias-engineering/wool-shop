import { ErrorInCosmosDbAccess } from '../failure'

export interface CreateUserRequest {
  email: string
  role: 'user'
}

export interface CreateUserResponse {
  id: string
}

export interface CreateUser {
  createUser(
    request: CreateUserRequest,
  ): Promise<CreateUserResponse | ErrorInCosmosDbAccess>
}
