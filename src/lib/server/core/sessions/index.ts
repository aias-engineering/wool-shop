import { match, P } from 'ts-pattern'
import {
  CreateSession,
  CreateSessionRequest,
  CreateSessionResponse,
} from '../data-access'
import { DeleteSession, ReadSessionsByToken } from '../data-access/sessions'
import {
  ErrorInCosmosDbAccess,
  isFailure,
  isErrorInCosmosDbAccess,
} from '../failure'
import {
  isMultipleSessionsWithTokenFound,
  isSessionWithTokenNotFound,
  MultipleSessionsWithTokenFound,
  SessionWithTokenNotFound,
} from './failure'
import { Unit } from '../types'

export interface Session {
  id: string
  expires: Date
  sessionToken: string
  userId: string
}

export function isSession(x: unknown): x is Session {
  const session = x as Session
  return (
    session.id !== undefined &&
    session.expires !== undefined &&
    session.sessionToken !== undefined &&
    session.userId !== undefined
  )
}

export const getSessionByToken = (
  sessionToken: string,
  dataAccess: ReadSessionsByToken,
): Promise<
  | Session
  | SessionWithTokenNotFound
  | MultipleSessionsWithTokenFound
  | ErrorInCosmosDbAccess
> =>
  dataAccess.readSessionsByToken(sessionToken).then((either) =>
    match(either)
      .with([], () => SessionWithTokenNotFound(sessionToken))
      .with([P.when(isSession)], ([session]) => session)
      .with([P.when(isSession), ...P.array()], () =>
        MultipleSessionsWithTokenFound(sessionToken),
      )
      .with(P.when(isFailure), (failure) => failure)
      .exhaustive(),
  )

export const createSession = (
  request: CreateSessionRequest,
  dataAccess: CreateSession,
): Promise<CreateSessionResponse | ErrorInCosmosDbAccess> =>
  dataAccess.createSession(request)

export const deleteSessionsByToken = (
  sessionToken: string,
  dataAccess: ReadSessionsByToken & DeleteSession,
): Promise<Unit | ErrorInCosmosDbAccess> =>
  getSessionByToken(sessionToken, dataAccess).then((either) =>
    match(either)
      .with(P.when(isErrorInCosmosDbAccess), (error) => error)
      .with(P.when(isSessionWithTokenNotFound), () => Unit.done)
      .with(P.when(isSession), (session) =>
        dataAccess.deleteSession(session.id),
      )
      .with(P.when(isMultipleSessionsWithTokenFound), () => Unit.done) // I should have a look at that.
      .exhaustive(),
  )
