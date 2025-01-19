import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
import {
  Error,
  ErrorMessage,
  ErrorTitle,
} from '@/app/components/molecules/error'
import { Failure } from '@/lib/client/failure'

interface Props {
  failure: Failure
}

export default function AdminErrorPage({ failure }: Props) {
  return (
    <>
      <Error>
        <ErrorTitle />
        <ErrorMessage>
          <Paragraph>De server reageerde met:</Paragraph>
          <Small>{failure.code}</Small>
          <Small>{failure.reason}</Small>
        </ErrorMessage>
      </Error>
    </>
  )
}
