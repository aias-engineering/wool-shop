import {
  CreateProduct,
  CreateProductRequest,
  CreateProductResponse,
  CreateProductRequestFormSchema,
  ReadAllProducts,
  ReadProduct,
  DeleteProduct,
} from './data-access'
import {
  ErrorInCosmosDbAccess,
  ProductValidationFailed,
  ProductWithIdNotFound,
} from './failure'
import { Product, Unit } from './types'

export const getAllProducts = (
  dataAccess: ReadAllProducts,
): Promise<Product[] | ErrorInCosmosDbAccess> => dataAccess.readAllProducts()

export const getProduct = (
  id: string,
  dataAccess: ReadProduct,
): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess> =>
  dataAccess.readProduct(id)

export const createProduct = async (
  formData: FormData,
  dataAccess: CreateProduct,
): Promise<
  CreateProductResponse | ProductValidationFailed | ErrorInCosmosDbAccess
> =>
  CreateProductRequestFormSchema.safeParseAsync({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    image: formData.get('image'),
  })
    .then((result) =>
      result.success
        ? new CreateProductRequest(
            result.data.name,
            result.data.description,
            result.data.price,
            result.data.image,
          )
        : ProductValidationFailed(result.error),
    )
    .then(async (either) =>
      either instanceof CreateProductRequest
        ? await dataAccess.createProduct(either)
        : either,
    )

export const deleteProduct = async (
  id: string,
  dataAccess: DeleteProduct,
): Promise<Unit | ErrorInCosmosDbAccess> => dataAccess.deleteProduct(id)
