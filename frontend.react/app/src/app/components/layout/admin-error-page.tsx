import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
import {
  Error,
  ErrorMessage,
  ErrorTitle,
} from '@/app/components/molecules/error'

interface Props {
  code: string
  reason: string
}

export default function AdminErrorPage({ code, reason }: Props) {
  return (
    <>
      <Error>
        <ErrorTitle />
        <ErrorMessage>
          <Paragraph>De server reageerde met:</Paragraph>
          <Small>{code}</Small>
          <Small>{reason}</Small>
        </ErrorMessage>
      </Error>
    </>
  )
}
