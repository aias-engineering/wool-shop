import { Failure } from '@/lib/failure'

export interface EmailValidationFailed extends Failure {
  readonly code: 'cur-00'
  readonly error: TypeError
}

export const EmailValidationFailed: (
  error: TypeError,
) => EmailValidationFailed = (error: TypeError) => ({
  type: 'failure',
  code: 'cur-00',
  reason: `Validation for the provided email failed`,
  error,
})

export function isEmailValidationFailed(
  x: unknown,
): x is EmailValidationFailed {
  const failure = x as EmailValidationFailed
  return (
    failure.type === 'failure' &&
    failure.code === 'cur-00' &&
    failure.reason !== undefined &&
    failure.error !== undefined
  )
}
