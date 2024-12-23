import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { withAzureDataAccess } from '@/lib/server'
import { getUser, isUser } from '@/lib/server/core/users'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email } = parsedCredentials.data

          const user = await withAzureDataAccess((dataAccess) =>
            getUser(email, dataAccess),
          )

          if (isUser(user)) return user

          return null
        }
        return null
      },
    }),
  ],
})
