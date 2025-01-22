import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [GitHub, Google],
  session: {
    strategy: 'jwt',
  },
})
