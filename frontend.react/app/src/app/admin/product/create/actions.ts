'use server'

import { storeImage } from "@/lib/azure/blob-store-client"
import { addImageToProduct, createProduct } from "@/lib/azure/cosmos-client"
import { nodeReadable_From_MdnReadableStream } from "@/lib/streams"
import { z } from "zod"

export async function handleCreateProductForm(formData: FormData) {

  console.log(formData)

  const schema = z.object({
    name: z.string(),
    price: z.string(),
    description: z.string().nullable()
  })

  const {data, error} =  await schema.safeParseAsync({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price')
  });

  const extractedFile = notNullFile(formData.get('image') as File)

  if (!error && extractedFile.state === 'validated'){
    const productRequest = {
      name: data.name,
      description: data.description,
      price: data.price
    }
    const response = await createProduct(productRequest)

    const imageFile = extractedFile.value
    const readable = nodeReadable_From_MdnReadableStream(imageFile.stream())

    const cosmosImageName = `${response.idOfCreated}/${imageFile.name}`
    await storeImage(cosmosImageName, readable)

    const imageLink = `/api/product/${response.idOfCreated}/image/${imageFile.name}`
    await addImageToProduct(response.idOfCreated, imageLink)
  }
  else{
    console.error('error %o', error)
    console.debug('image: %o', extractedFile)
  }
}

function notNullFile (input: File | null)
  : | {state: 'null'} 
    | {state: 'validated', value: File} {
  if (input === null)
    return { state: 'null' };
  else
    return { state: 'validated', value: input! }
}