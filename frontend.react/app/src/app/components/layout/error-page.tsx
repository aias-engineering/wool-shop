import P from '@/app/components/atoms/p'
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
          <P>De server reageerde met:</P>
          <Small>{message}</Small>
        </ErrorMessage>
      </Error>
    </>
  )
}
