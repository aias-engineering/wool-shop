import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const ProductFormSchema = z.object({
  id: zfd.text(z.string()),
  name: zfd.text(z.string().min(1)),
  description: zfd.text(z.string().nullable()),
  price: zfd.numeric(z.number().gte(0)),
  image: zfd.text(z.string()),
})
