'use client'

import { useSession } from "next-auth/react"
import Button from "@/app/components/atoms/button"
import { useLocale } from "next-intl"
import { useRouter } from 'next/navigation'
import { MightHaveClassName } from "@/lib/client/react"
import clsx from "clsx"

export const LangTrigger = ({className}: MightHaveClassName) => {
  const currentLocale = useLocale()
  const session = useSession()
  const router = useRouter()

  const changeLanguage = (newLang: 'nl'|'en') => 
    session.update({lang: newLang})
      .then(() => router.refresh())

  if (currentLocale === 'en') {
    return (
      <Button type='button' variant="outline" className={clsx(className)} onClick={() => changeLanguage('nl')}>NL</Button>)
  } else {
    return (
      <Button type='button' variant="outline" className={clsx(className)} onClick={() => changeLanguage('en')}>EN</Button>)
  }
}