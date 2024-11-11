import { mdnReadableStream_From_NodeReadableStream, nodeReadable_From_MdnReadableStream } from '@/lib/streams';
import { BlobDeleteIfExistsResponse, BlobDownloadResponseParsed, BlobServiceClient, BlobUploadCommonResponse, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import dotenv from 'dotenv'
import { match, P } from 'ts-pattern';
import { DeleteImageBlobResult, DonwloadImageResult, ListImagesResult, UploadImageResult } from '@/lib/server/core/types';
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

export async function listImages(): Promise<ListImagesResult> {
  try {
    let imagenames: string[] = []

    for await (const blob of images().listBlobsFlat()) {
      imagenames = [...imagenames, blob.name]
    }
    return {state: 'success', imagenames}

  } catch (error: unknown) {
    return {state: 'failure', message: (error as TypeError).message }
  }
}

export async function downloadImage(blobname: string): Promise<DonwloadImageResult> {
  try {
    const blockBlobClient = images().getBlockBlobClient(blobname);

    const downloadResponse = await blockBlobClient.download()

    return match<BlobDownloadResponseParsed, DonwloadImageResult>(downloadResponse)
      .with({ readableStreamBody: undefined, errorCode: P.string }, ({errorCode}) => ({
        state: 'failure',
        message: errorCode
      }))
      .with({ readableStreamBody: undefined }, () => ({ state: 'not-found' }))
      .with({ readableStreamBody: P.not(undefined) }, ({readableStreamBody}) => ({
        state: 'success',
        imageStream: mdnReadableStream_From_NodeReadableStream(readableStreamBody)
      }))
      .exhaustive()
  } catch(err) {
    return {state: 'failure', message: (err as TypeError)?.message }
  }
}

export async function uploadImage(blobname: string, stream: ReadableStream): Promise<UploadImageResult> {
  
  const blockBlobClient = images().getBlockBlobClient(blobname)

  const nodeReadable = nodeReadable_From_MdnReadableStream(stream)

  const response = await blockBlobClient.uploadStream(nodeReadable)

  return match<BlobUploadCommonResponse, UploadImageResult>(response)
    .with({errorCode: undefined}, () => ({state: 'success'}))
    .with({errorCode: P.string}, ({errorCode}) => ({state: 'failure', message: errorCode}))
    .exhaustive()
}

export async function deleteImageBlob(blobname: string): Promise<DeleteImageBlobResult> {
  try {
    const blockBlobClient = images().getBlockBlobClient(blobname);

    const response = await blockBlobClient.deleteIfExists()

    return match<BlobDeleteIfExistsResponse, DeleteImageBlobResult>(response)
      .with({errorCode: undefined}, () => ({state: 'success'}))
      .with({errorCode: P.string}, ({errorCode}) => ({state: 'failure', message: errorCode}))
      .exhaustive()
  } catch(err) {
    return { state: 'failure', message: (err as TypeError)?.message }
  }
}