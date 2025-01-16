'use server'

import { signIn } from '@/auth'
import { withAzureDataAccess } from '@/lib/server'
import {
  EmailValidationFailed,
  isUserWithEmailNotFound,
} from '@/lib/server/core/failure'
import { getUserByEmail, isUser } from '@/lib/server/core/users'
import { AuthError } from 'next-auth'
import { match, P } from 'ts-pattern'
import { z } from 'zod'

export type ExistsEmailState =
  | 'idle'
  | 'exists'
  | 'not-exists'
  | { state: 'error'; code: string; reason: string; error?: TypeError }

export const checkEmailOnServer: (
  formData: FormData,
) => Promise<ExistsEmailState> = async (formData: FormData) =>
  z
    .string()
    .email()
    .safeParseAsync(formData.get('email'))
    .then((parseResult) =>
      parseResult.success
        ? parseResult.data
        : EmailValidationFailed(parseResult.error),
    )
    .then((either) =>
      typeof either === 'string'
        ? withAzureDataAccess((dataAccess) =>
            getUserByEmail(either, dataAccess),
          )
        : either,
    )
    .then((either) =>
      match(either)
        .with(P.when(isUser), () => 'exists' as ExistsEmailState)
        .with(
          P.when(isUserWithEmailNotFound),
          () => 'not-exists' as ExistsEmailState,
        )
        .with(
          { type: 'failure', error: P.any },
          ({ code, reason, error }) =>
            ({
              state: 'error',
              code: code,
              reason: reason,
              error: error,
            }) as ExistsEmailState,
        )
        .with(
          { type: 'failure' },
          ({ code, reason }) =>
            ({
              state: 'error',
              code: code,
              reason: reason,
            }) as ExistsEmailState,
        )
        .exhaustive(),
    )

export const authorize = async (formData: FormData) =>
  signIn('credentials', formData).catch((error) => {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials'
        default:
          return 'Something went wrong'
      }
    }
    throw error
  })

export const signInViaGithub = async (redirectTo: string | null) =>
  signIn('github', { redirectTo: redirectTo ?? undefined })

export const signInViaGoogle = async (redirectTo: string | null) => 
  signIn('google', { redirectTo: redirectTo ?? undefined })
