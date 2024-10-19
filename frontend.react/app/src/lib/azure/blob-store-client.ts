import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import dotenv from 'dotenv'
import internal from 'stream';
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

function images(): ContainerClient {
  return blobService.getContainerClient('images');
}

export async function storeImage(blobname: string, stream: internal.Readable) {
  const blockBlobClient = images().getBlockBlobClient(blobname)
  
  await blockBlobClient.uploadStream(stream)
}

export async function downloadImage(blobname: string): Promise<NodeJS.ReadableStream | null>
{
  const blockBlobClient = images().getBlockBlobClient(blobname);

  const downloadResponse = await blockBlobClient.download()

  return downloadResponse.readableStreamBody ?? null
}

export async function deleteImage(blobname: string) {
  const blockBlobClient = images().getBlockBlobClient(blobname);

  await blockBlobClient.deleteIfExists()
}