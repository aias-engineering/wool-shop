import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import dotenv from 'dotenv'
import internal, { Stream } from 'stream';
dotenv.config()


const accountName = 'tsa0jxc3reuapiywm';

const credentials = new StorageSharedKeyCredential(
  accountName,
  process.env.WOOL_SHOP_BLOBSTORAGE_KEY as string
)

const blobService = new BlobServiceClient(
  'https://tsa0jxc3reuapiywm.blob.core.windows.net',
  credentials
)

export async function storeImage(blobname: string, stream: internal.Readable) {
  console.log('storing image %o', blobname)
  const containerClient = blobService.getContainerClient('images')
  const blockBlobClient = containerClient.getBlockBlobClient(blobname)
  await blockBlobClient.uploadStream(stream)
}