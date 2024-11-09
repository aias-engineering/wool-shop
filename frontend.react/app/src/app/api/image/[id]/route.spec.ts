import { expect, test } from 'vitest'
import { DELETE } from './route'


test('DELETE on non existing image should return 404', async () => {
  
  // ACT
  const result = DELETE(null, { params: { id: 'sheep.jpg' } })

  // ASSERT
  expect((await result).status).toBe(404)
})