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

export async function getImagesFlat() {
  console.log('getting images flat..')
  let result: string[] = []
  for await (const blob of images().listBlobsFlat()) {
    result = [...result, blob.name]
  }
  return result;
}

export async function storeImage(blobname: string, stream: internal.Readable) {
  const blockBlobClient = images().getBlockBlobClient(blobname)
  
  const result = await blockBlobClient.uploadStream(stream)

  console.log('%o', result)
}

export async function downloadImage(blobname: string): Promise<NodeJS.ReadableStream | null>
{
  const blockBlobClient = images().getBlockBlobClient(blobname);

  const downloadResponse = await blockBlobClient.download()
  
  console.log('received from azure: %i', downloadResponse.contentLength)

  return downloadResponse.readableStreamBody ?? null
}

export async function deleteBlobOnAzure(blobname: string) {
  const blockBlobClient = images().getBlockBlobClient(blobname);

  await blockBlobClient.deleteIfExists()
}