'use client'

import Button from "@/app/components/atoms/button"
import Spinner from "@/app/components/atoms/spinner"
import { Error, ErrorMessage } from "@/app/components/molecules/error"
import { PrimitiveAtom, useSetAtom } from "jotai"
import { atom, useAtomValue } from "jotai"
import { Trash2 } from "lucide-react"
import { match, P } from "ts-pattern"

type ProductDeleteState = 
| { step: 'idle' }
| { step: 'deleting', productId: string}
| { step: 'done', productId: string }
| { step: 'failure', productId: string, message: string }

const productDeleteStateAtom = atom<ProductDeleteState>({ step: 'idle' })

const deleteProductAction = atom(null, 
  async (_, set, productId: string, reportAtom: PrimitiveAtom<ProductDeleteState>) => {
    set(reportAtom, {step: 'deleting', productId })
    fetch(`/api/product/${productId}`, { method: 'DELETE' })
      .then(response => 
        response.ok 
          ? set(reportAtom, {step: 'done', productId})
          : set(reportAtom, {step: 'failure', productId, message: response.statusText})
      )
      .catch(error => 
        set(reportAtom, {step: 'failure', productId, message: (error as TypeError)?.message})) 
})

interface Props {
  productId: string
}

export default function DeleteProductButton({ productId }: Props) {
  const productDeleteState = useAtomValue(productDeleteStateAtom)
  const deleteProduct = useSetAtom(deleteProductAction)

  return (
    <>
      {match(productDeleteState)
        .with({ step: 'idle' }, () => (
          <Button onClick={() => deleteProduct(productId, productDeleteStateAtom)}>
            <Trash2 /> verwijderen
          </Button>
        ))
        .with({step: 'deleting', productId: productId }, () => (
          <Button>
            <Spinner /> verwijderen
          </Button>
        ))
        .with({step: 'deleting' }, () => (<></>))
        .with({step: 'done', productId: productId }, () => (
          <>
            succesvol verwijderd.. Ik zal binnen een seconde verdwijnen ;)
          </>
        ))
        .with({step: 'failure', productId: productId }, ({message}) => (
          <>
            <Error>
              <ErrorMessage>{message}</ErrorMessage>
            </Error>
          </>
        ))
        .otherwise(() => (
          <Button onClick={() => deleteProduct(productId, productDeleteStateAtom)}>
            <Trash2 /> verwijderen
          </Button>
        ))
      }
    </>
  )
}