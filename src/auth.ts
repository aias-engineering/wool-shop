import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { authConfig } from './auth.config'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    lang?: 'nl' | 'en'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    lang?: 'nl' | 'en'
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    GitHub,
    Google
  ],
  callbacks: {
    jwt({token, trigger, session}) {
      if (trigger === 'update'){
        token.lang = session.lang
      }
      return token
    },
    session({session, token}) {
      session.lang = (token.lang || 'nl')
      return session
    }
  },
  session: {
    strategy: 'jwt',
  },
})
