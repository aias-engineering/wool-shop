import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import { z } from 'zod'
import { withAzureDataAccess } from '@/lib/server'
import { getUserByEmail, isUser } from '@/lib/server/core/users'
import { CosmosDbAdapter } from './lib/server/boundary/authjs/cosmos-db-adapter'

const dataAccessProvider = () =>
  withAzureDataAccess(async (dataAccess) => dataAccess)

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: CosmosDbAdapter(dataAccessProvider),
  providers: [
    GitHub,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email } = parsedCredentials.data

          const user = await withAzureDataAccess((dataAccess) =>
            getUserByEmail(email, dataAccess),
          )

          if (isUser(user)) return user

          return null
        }
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt'
  }
})
