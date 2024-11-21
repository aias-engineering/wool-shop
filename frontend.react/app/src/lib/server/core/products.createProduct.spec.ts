import { expect, test } from "vitest";
import { CreateProduct } from "./data-access";
import { createProduct } from "./products";
import { ProductValidationFailed } from "./failure";

const id = Math.random().toString()
const defaultDataAccess: CreateProduct = {
  createProduct: async (request) => ({ id, request })
}

const woolySheep = {
  name: 'Wooly sheep',
  description: "it's a wooly sheep",
  price: '80.00',
  image: '/api/image/wool-sheep.avif'
}

test('with valid request should save to data Access', async () => {
  // ARRANGE
  const formData = createFormData(woolySheep)

  const response = await createProduct(formData, defaultDataAccess)

  expect(response).toMatchObject({ id, request: { name: 'Wooly sheep', description: "it's a wooly sheep", price: 80.00, image: '/api/image/wool-sheep.avif' } })
})

test.each([
  undefined, 
  null, 
  ""
])('with { name: %s } should return validation error', async (name) => {
  const formData = createFormData({
    ...woolySheep,
    name
  })

  const response = await createProduct(formData, defaultDataAccess)

  expect(response).toBeInstanceOf(ProductValidationFailed)
})

test.each([
  undefined
])('with { description: %s } should return validation error', async (description) => {
  const formData = createFormData({
    ...woolySheep,
    description
  })

  const response = await createProduct(formData, defaultDataAccess)

  expect(response).toBeInstanceOf(ProductValidationFailed)
})

test.each([
  undefined, 
  null, 
  "",
  "string",
  "11,00"
])('with { price: %s } should return validation error', async (price) => {
  const formData = createFormData({
    ...woolySheep,
    price
  })

  const response = await createProduct(formData, defaultDataAccess)

  expect(response).toBeInstanceOf(ProductValidationFailed)
})

test.each([
  undefined, 
  null, 
  ""
])('with { image: %s } should return validation error', async (image) => {
  const formData = createFormData({
    ...woolySheep,
    image
  })

  const response = await createProduct(formData, defaultDataAccess)

  expect(response).toBeInstanceOf(ProductValidationFailed)
})

function createFormData(input: object): FormData {
  const form = new FormData()
  Object.keys(input)
    .forEach(property => {
      const value = input[property as keyof object]
      if (value)
        form.append(property, value);
    })
  return form
}