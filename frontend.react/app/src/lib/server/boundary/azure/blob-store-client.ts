import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob'
import dotenv from 'dotenv'
dotenv.config()

const accountName = 'tsa0jxc3reuapiywm'

const credentials = () =>
  new StorageSharedKeyCredential(
    accountName,
    process.env.WOOL_SHOP_BLOBSTORAGE_KEY as string,
  )

const blobService = () =>
  new BlobServiceClient(
    'https://tsa0jxc3reuapiywm.blob.core.windows.net',
    credentials(),
  )

export function images(): ContainerClient {
  return blobService().getContainerClient('images')
}
