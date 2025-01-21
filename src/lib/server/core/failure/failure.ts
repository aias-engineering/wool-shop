export interface Failure {
  readonly type: 'failure'
  readonly code: string
  readonly reason: string
}

export function isFailure(x: unknown): x is Failure {
  const failure = x as Failure
  return (
    failure !== undefined &&
    failure.code !== undefined &&
    failure.reason !== undefined &&
    failure.type === 'failure'
  )
}
