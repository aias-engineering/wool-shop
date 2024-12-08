'use client'

import Button from '@/app/components/atoms/button'
import Spinner from '@/app/components/atoms/spinner'
import { Error, ErrorMessage } from '@/app/components/molecules/error'
import { Trash2 } from 'lucide-react'
import { match } from 'ts-pattern'
import { deleteProductAction } from './actions'
import { useState } from 'react'

type ProductDeleteState =
  | { step: 'idle' }
  | { step: 'deleting'; productId: string }
  | { step: 'done'; productId: string }
  | { step: 'failure'; productId: string; message: string }

interface Props {
  productId: string
}

export default function DeleteProductButton({ productId }: Props) {
  const [state, setState] = useState<ProductDeleteState>({ step: 'idle' })

  const handleDeleteProduct = async () => {
    setState({ step: 'deleting', productId })
    deleteProductAction(productId).then((response) =>
      response?.type !== 'error'
        ? setState({ step: 'done', productId })
        : setState({ step: 'failure', productId, message: response.reason }),
    )
  }

  return (
    <>
      {match(state)
        .with({ step: 'idle' }, () => (
          <Button onClick={() => handleDeleteProduct()}>
            <Trash2 /> verwijderen
          </Button>
        ))
        .with({ step: 'deleting', productId: productId }, () => (
          <Button>
            <Spinner /> verwijderen
          </Button>
        ))
        .with({ step: 'deleting' }, () => <></>)
        .with({ step: 'done', productId: productId }, () => (
          <>succesvol verwijderd.. Ik zal binnen een seconde verdwijnen ;)</>
        ))
        .with({ step: 'failure', productId: productId }, ({ message }) => (
          <>
            <Error>
              <ErrorMessage>{message}</ErrorMessage>
            </Error>
          </>
        ))
        .otherwise(() => (
          <Button onClick={() => handleDeleteProduct(productId)}>
            <Trash2 /> verwijderen
          </Button>
        ))}
    </>
  )
}
