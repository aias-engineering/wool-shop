import {type Failure} from '../failure'

export interface WishlistWithIdNotFound extends Failure {
  readonly code: 'cwl-01'
  readonly id: string
}

export const WishlistWithIdNotFound = (id: string): WishlistWithIdNotFound => ({
  type: 'failure',
  code: 'cwl-01',
  reason: `The wishlist with id ${id} wasn't found in the Azure Cosmos DB`,
  id,
})

export function isWishlistWithIdNotFound(x: unknown): x is WishlistWithIdNotFound {
  const failure = x as WishlistWithIdNotFound
  return (
    failure.type === 'failure' &&
    failure.code === 'cwl-01' &&
    failure.reason !== undefined &&
    failure.id !== undefined
  )
}