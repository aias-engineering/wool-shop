import { z } from "zod"
import { zfd } from "zod-form-data"
import { CreateProductRequest } from "../data-access"

const infoSchema = z.object({
  name: zfd.text(z.string().min(1)),
  description: zfd.text().nullable(),
  price: zfd.numeric(z.number().gte(0))
})

const createProductRequestFormSchema = z.object({
  infoNl: infoSchema,
  image: zfd.text(z.string()),
})

export const validateCreateProductRequest = (formData: FormData): Promise<z.SafeParseReturnType<CreateProductRequest, CreateProductRequest>> =>
  createProductRequestFormSchema.safeParseAsync({
    infoNl: {
      name: formData.get('infoNl.name'),
      description: formData.get('infoNl.description'),
      price: formData.get('infoNl.price')
    },
    image: formData.get('image'),
  })