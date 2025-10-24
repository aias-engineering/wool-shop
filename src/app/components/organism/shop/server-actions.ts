'use server'

import { withAzureDataAccess } from '@/lib/server'
import {
  ErrorInCosmosDbAccess,
  isErrorInCosmosDbAccess,
} from '@/lib/server/core/failure'
import { isUnit } from '@/lib/server/core/types'
import {
  CreateWishlistRequest,
  createWithlist,
} from '@/lib/server/core/wishlists'
import { revalidatePath, revalidateTag } from 'next/cache'
import { match, P } from 'ts-pattern'

export type SaveWishlistState =
  | 'idle'
  | 'pending'
  | 'submitted'
  | { state: 'failure'; failure: ErrorInCosmosDbAccess }

export async function saveWishlistOnServer(
  prev: SaveWishlistState,
  request: CreateWishlistRequest,
): Promise<SaveWishlistState> {
  return withAzureDataAccess((dataAccess) =>
    createWithlist(request, dataAccess),
  )
  .then((either) =>
    {
      if (isUnit(either)){
        revalidatePath('wishlists')
        revalidateTag('wishlists')
      }
      return either
    })
  .then((either) =>
    match(either)
      .with(P.when(isUnit), () => 'submitted' as SaveWishlistState)
      .with(
        P.when(isErrorInCosmosDbAccess),
        (failure) => ({ state: 'failure', failure }) as SaveWishlistState,
      )
      .exhaustive(),
  )
}
