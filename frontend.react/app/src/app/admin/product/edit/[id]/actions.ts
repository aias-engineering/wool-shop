'use server'

import { Product } from "@/lib/server/core/products"

export type SaveProductState = 
  | 'idle'

export async function saveProductOnServer(prev: SaveProductState, formData: FormData): Promise<SaveProductState> {

  return 'idle'
}