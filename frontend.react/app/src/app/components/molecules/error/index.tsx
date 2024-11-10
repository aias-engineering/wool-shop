import HasChildren from '@/lib/client/react/has-children'
import './_error.css'
import { Squirrel } from 'lucide-react'
import Title from '@/app/components/atoms/title'

export function Error({children}: HasChildren) {
  return (
    <>
      <div className='error'>
        {children}
      </div>
    </>
  )
}

export function ErrorTitle({children}: HasChildren) {
  return (
    <>
      <div className='error__title'>
        {children || (
          <>
            <Squirrel height={96} width={96} />
            <Title type='h3'>Helaas pindakaas... er ging iets mis</Title>
          </>
        )}
      </div>
    </>
  )
}

export function ErrorMessage({children}: HasChildren) {
  return (
    <>
      <div className='error__message'>
        {children}
      </div>
    </>
  )
}