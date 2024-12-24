import { ErrorInCosmosDbAccess } from '../failure'

export interface CreateUserRequest {
  email: string
}

export interface CreateUserResponse {
  id: string
}

export interface CreateUser {
  createUser(
    request: CreateUserRequest,
  ): Promise<CreateUserResponse | ErrorInCosmosDbAccess>
}
