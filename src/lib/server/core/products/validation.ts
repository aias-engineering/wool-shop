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
  infoEn: infoSchema.or(z.undefined()),
  image: zfd.text(z.string()),
})

const extractInfo = (name: string, formData: FormData) => ({
  name: formData.get(`${name}.name`),
  description: formData.get(`${name}.description`),
  price: formData.get(`${name}.price`)
}) 

export const validateCreateProductRequest = (formData: FormData): Promise<z.SafeParseReturnType<CreateProductRequest, CreateProductRequest>> =>
  createProductRequestFormSchema.safeParseAsync({
    infoNl: extractInfo('infoNl', formData),
    infoEn: extractInfo('infoEn', formData),
    image: formData.get('image'),
  })