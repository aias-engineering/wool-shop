'use client'

import Button from '@/app/components/atoms/button'
import Input from '@/app/components/atoms/input'
import Paragraph from '@/app/components/atoms/paragraph'
import Title from '@/app/components/atoms/title'
import { useState } from 'react'
import {
  authorize,
  checkEmailOnServer,
  ExistsEmailState,
  signInViaGithub,
} from './actions'
import { match, P } from 'ts-pattern'
import Alert, {
  AlertDescription,
  AlertTitle,
} from '../components/molecules/alert'
import { AlertCircle, Github } from 'lucide-react'
import { Separator } from '../components/atoms/separator'

export default function SignIn({}) {
  const [existsEmailState, setExistsEmailState] =
    useState<ExistsEmailState>('idle')

  const handleCheckEmail = (formData: FormData) =>
    checkEmailOnServer(formData).then(setExistsEmailState)

  return (
    <>
      {match(existsEmailState)
        .with('idle', () => (
          <>
            <div className="text-center space-y-2">
              <Title type="h2" className="border-b-0">
                login
              </Title>
              <Paragraph>log in met uw e-mailadres</Paragraph>
            </div>
            <form action={handleCheckEmail}>
              <div className="pt-6 px-1 grid gap-1">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                />
                <Button>aanmelden met e-mail</Button>
              </div>
            </form>
            <form action={signInViaGithub}>
              <div className="px-1 grid grap-1">
                <Separator />
                <Button>
                  <Github></Github>
                  aanmelden met github
                </Button>
              </div>
            </form>
          </>
        ))
        .with(P.union('exists', 'not-exists'), () => (
          <>
            <div className="text-center space-y-2">
              <Title type="h2" className="border-b-0">
                login
              </Title>
              <Paragraph>voltooi uw login met uw wachtwoord</Paragraph>
            </div>
            <form action={authorize}>
              <div className="pt-6 px-1 grid gap-1">
                <Input name="email" type="hidden" />
                <Input name="password" type="password" />
                <Button>aanmelden</Button>
              </div>
            </form>
          </>
        ))
        .with({ state: 'error' }, ({ code, reason, error }) => (
          <>
            <div className="text-center space-y-2">
              <Title type="h2" className="border-b-0">
                login
              </Title>
              <Paragraph>log in met uw e-mailadres</Paragraph>
            </div>
            <Alert className="alert--desctructive px-1">
              <AlertCircle></AlertCircle>
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                {code}: {reason}
                {error && error.message}
              </AlertDescription>
            </Alert>
            <form action={handleCheckEmail}>
              <div className="pt-6 px-1 grid gap-1">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                />
                <Button>aanmelden met e-mail</Button>
              </div>
            </form>
          </>
        ))
        .otherwise(() => (
          <></>
        ))}
    </>
  )
}
