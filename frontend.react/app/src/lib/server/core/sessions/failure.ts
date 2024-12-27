import { Failure } from '../failure'

export interface SessionWithTokenNotFound extends Failure {
  readonly code: 'cse-01'
  readonly sessionToken: string
}

export const SessionWithTokenNotFound = (
  sessionToken: string,
): SessionWithTokenNotFound => ({
  type: 'failure',
  code: 'cse-01',
  reason: `The session with token ${sessionToken} not found in the Azure Cosmos DB.`,
  sessionToken,
})

export function isSessionWithTokenNotFound(
  x: unknown,
): x is SessionWithTokenNotFound {
  const failure = x as SessionWithTokenNotFound
  return (
    failure.type === 'failure' &&
    failure.code === 'cse-01' &&
    failure.reason !== undefined &&
    failure.sessionToken !== undefined
  )
}

export interface MultipleSessionsWithTokenFound extends Failure {
  readonly code: 'cse-02'
  readonly sessionToken: string
}

export const MultipleSessionsWithTokenFound = (
  sessionToken: string,
): MultipleSessionsWithTokenFound => ({
  type: 'failure',
  code: 'cse-02',
  reason: `Multiple sessions with token ${sessionToken} found in the Azure Cosmos DB.`,
  sessionToken,
})

export function isMultipleSessionsWithTokenFound(
  x: unknown,
): x is MultipleSessionsWithTokenFound {
  const failure = x as MultipleSessionsWithTokenFound
  return (
    failure.type === 'failure' &&
    failure.code === 'cse-02' &&
    failure.reason !== undefined &&
    failure.sessionToken !== undefined
  )
}
