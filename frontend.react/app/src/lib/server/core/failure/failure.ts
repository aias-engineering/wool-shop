export interface Failure {
  readonly type: 'failure'
  readonly code: string
  readonly reason: string
}

export function isFailure(x: unknown): x is Failure {
  const failure = x as Failure
  if (!failure.code) return false
  if (!failure.reason) return false
  return failure.type === 'failure'
}
