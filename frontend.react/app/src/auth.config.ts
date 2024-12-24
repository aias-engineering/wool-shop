import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedin = !!auth?.user
      const isInAdmin = nextUrl.pathname.startsWith('/admin')
      if (isInAdmin) {
        if (isLoggedin) return true
        return false
      }
      return true
    },
  },
  debug: true,
  providers: [],
} satisfies NextAuthConfig
