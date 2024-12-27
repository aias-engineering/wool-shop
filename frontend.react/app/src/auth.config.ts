import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user
      const isInAdmin = nextUrl.pathname.startsWith('/admin')
      const adminUsersConfigured = process.env.AUTH_ADMIN_ACCOUNTS
      if (isInAdmin) {
        if (user?.email) {
          if (adminUsersConfigured) {
            const adminUsers = JSON.parse(adminUsersConfigured) as string[]
            if (adminUsers.filter((admin) => admin === user.email)) {
              return true
            }
          }
        }
        return false
      }
      return true
    },
  },
  debug: true,
  providers: [],
} satisfies NextAuthConfig
