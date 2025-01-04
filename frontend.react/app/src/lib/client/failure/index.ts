import { Failure, isFailure } from "@/lib/server/core/failure"

export interface ServerFailure extends Failure {}

export function ServerFailure(innerFailure: Failure): ServerFailure {
  return (innerFailure)
}

export interface UnknownServerFailure extends Failure {
  readonly code: 'cle-00'
  readonly reason: 'The server returned an internal error without any details.'
}

export const UnknownServerFailure = (): UnknownServerFailure => ({
  type: 'failure',
  code: 'cle-00',
  reason: 'The server returned an internal error without any details.'
})

export const processFailureResponse = (response: Response): Promise<ServerFailure|UnknownServerFailure> =>
  response.json()
    .then(data => isFailure(data)
      ? ServerFailure(data)
      : UnknownServerFailure())