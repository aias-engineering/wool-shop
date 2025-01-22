import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('locale')

  const locale = localeCookie?.value || 'nl'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
