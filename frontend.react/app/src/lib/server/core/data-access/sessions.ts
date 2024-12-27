import { ErrorInCosmosDbAccess } from '../failure'
import { Session } from '../sessions'
import { Unit } from '../types'

export interface CreateSessionRequest {
  expires: Date
  sessionToken: string
  userId: string
}

export interface CreateSessionResponse {
  id: string
}

export interface CreateSession {
  createSession(
    request: CreateSessionRequest,
  ): Promise<CreateSessionResponse | ErrorInCosmosDbAccess>
}

export interface ReadSessionsByToken {
  readSessionsByToken(
    sessionToken: string,
  ): Promise<Session[] | ErrorInCosmosDbAccess>
}

export interface DeleteSession {
  deleteSession(id: string): Promise<Unit | ErrorInCosmosDbAccess>
}
