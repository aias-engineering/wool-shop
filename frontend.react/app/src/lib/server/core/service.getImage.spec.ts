import { expect, test } from "vitest"
import { getImage } from "./service"
import { match } from "ts-pattern"
import { DownloadDidntReturnStream, ErrorInBlobStorageAccess } from "./failure"

const ID_OF_EXISTING_IMAGE = 'existing.avif'
const ID_OF_NOT_EXISTING_IMAGE = 'not-existing.avif'
const imageStream = new ReadableStream()

const downloadImageBlob = async(blobname: string): Promise<ReadableStream|undefined> => 
    match(blobname)
      .with(ID_OF_EXISTING_IMAGE, () => imageStream)
      .with(ID_OF_NOT_EXISTING_IMAGE, () => undefined)
      .otherwise(() => { throw 'DOWNLOAD FAILED' })

test('getImage with existingImage should return image', async () => {

  const result = await getImage(ID_OF_EXISTING_IMAGE, downloadImageBlob)

  expect(result).toBe(imageStream)
})

test('getImage with non existing image should return undefined', async () => {

  const result = await getImage(ID_OF_NOT_EXISTING_IMAGE, downloadImageBlob)

  expect(result).toBeInstanceOf(DownloadDidntReturnStream)
})

test('getImage when blob storage throws', async () =>  {
  const downloadImageBlob = async() => { throw 'DOWNLOAD FAILED'}
  
  const result = await getImage(ID_OF_EXISTING_IMAGE, downloadImageBlob)

  expect(result).toBeInstanceOf(ErrorInBlobStorageAccess)
})