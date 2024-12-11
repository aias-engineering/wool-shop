import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
import {
  Error,
  ErrorMessage,
  ErrorTitle,
} from '@/app/components/molecules/error'

interface Props {
  message: string
}

export default function ErrorPage({ message }: Props) {
  return (
    <>
      <Error>
        <ErrorTitle />
        <ErrorMessage>
          <Paragraph>De server reageerde met:</Paragraph>
          <Small>{message}</Small>
        </ErrorMessage>
      </Error>
    </>
  )
}
