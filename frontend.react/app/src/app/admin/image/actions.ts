'use server'

import { revalidatePath } from "next/cache"

export async function deleteImage(blobname: string) {
  console.log('deleting image %s', blobname)
  revalidatePath('images')
}