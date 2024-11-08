'use server'

import { createProduct, CreateProductRequest } from "@/lib/azure/cosmos-client"
import { z } from "zod"

export async function handleCreateProductForm(formData: FormData) {

  const schema = z.object({
    name: z.string(),
    price: z.string(),
    description: z.string().nullable(),
    image: z.string()
  })

  const {data, error} =  await schema.safeParseAsync({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    image: formData.get('image')
  });

  if (!error){
    const productRequest: CreateProductRequest = {
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image
    }
    await createProduct(productRequest)
  }
  else{
    console.error('error %o', error)
  }
}