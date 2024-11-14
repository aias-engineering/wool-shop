import { expect, test } from "vitest"
import { getImages } from "./service"
import { ErrorInBlobStorageAccess } from "./failure"

[
  [], 
  ['some string']
]
.map(imageBlobsFlat => 
  test('getImages on working blob storage should promote result', async (imageBlobsFlat: string[]) => {
  
    const listImageBlobsFlat = async(): Promise<string[]> => imageBlobsFlat

    const result = await getImages(listImageBlobsFlat)

    expect(result).toBe(imageBlobsFlat)
  })
)

test('getImage when blob storage throws', async () =>  {
  const listImageBlobsFlat = async() => { throw 'DOWNLOAD FAILED'}
  
  const result = await getImages(listImageBlobsFlat)

  expect(result).toBeInstanceOf(ErrorInBlobStorageAccess)
})