'use server'

import Button from '@/app/components/atoms/button'
import { MightHaveClassName } from '@/lib/client/react'
import clsx from 'clsx'
import { getLocale } from 'next-intl/server'
import { setLocaleCookie } from '../../layout/actions'

export const LangTrigger = async ({ className }: MightHaveClassName) => {
  const currentLocale = await getLocale()

  if (currentLocale === 'en') {
    return (
      <div className={clsx(className)}>
        <form action={setLocaleCookie.bind(null, 'nl')}>
          <Button type="submit" variant="outline">
            NL
          </Button>
        </form>
      </div>
    )
  } else {
    return (
      <div className={clsx(className)}>
        <form action={setLocaleCookie.bind(null, 'en')}>
          <Button type="submit" variant="outline">
            EN
          </Button>
        </form>
      </div>
    )
  }
}
