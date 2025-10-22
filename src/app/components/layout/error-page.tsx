import Paragraph from '@/app/components/atoms/paragraph'
import Small from '@/app/components/atoms/small'
import {
  Error,
  ErrorMessage,
  ErrorTitle,
} from '@/app/components/molecules/error'
import { Failure } from '@/lib/client/failure'
import Large from '../atoms/large'
import Space from '../atoms/space'

interface Props {
  failure: Failure
}

export default function ErrorPage({ failure }: Props) {
  return (
    <>
      <Error>
        <ErrorTitle />
        <ErrorMessage>
          <Paragraph>
            <Large className="mr-1">{failure.code}</Large>
            <Large>{failure.reason}</Large> 
          </Paragraph>
          {process.env.NODE_ENV !== "production" &&
           failure.error &&
            (
              <div className='flex flex-col'>
                <pre>{failure.error.name}: {failure.error.message}</pre>
                <Space />
                <pre>
                  {failure.error.stack}
                </pre>
              </div>
            )
          }
        </ErrorMessage>
      </Error>
    </>
  )
}
