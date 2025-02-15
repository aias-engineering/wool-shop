'use server'

import { signOut } from '@/auth'
import { withAzureDataAccess } from '@/lib/server'
import { deleteProduct } from '@/lib/server/core/products'

export async function handleDeleteProduct(id: string) {
  console.log('deleting product %s', id)

  withAzureDataAccess((dataAccess) => deleteProduct(id, dataAccess))
}

export const logout = async () => signOut({ redirectTo: '/' })
