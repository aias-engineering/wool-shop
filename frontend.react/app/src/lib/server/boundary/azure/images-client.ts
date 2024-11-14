import { BlobUploadCommonResponse } from "@azure/storage-blob";
import { Unit, UploadImageResult } from "../../core/types";
import { images } from "./blob-store-client";
import { match, P } from "ts-pattern";
import { mdnReadableStream_From_NodeReadableStream, nodeReadable_From_MdnReadableStream } from "@/lib/streams";


export async function listImages(): Promise<string[]> {
  let imagenames: string[] = []

  for await (const blob of images().listBlobsFlat()) {
    imagenames = [...imagenames, blob.name]
  }
  return imagenames
}

export async function downloadImage(blobname: string): Promise<ReadableStream|undefined> {
  const blockBlobClient = images().getBlockBlobClient(blobname);

  const downloadResponse = await blockBlobClient.download()

  return downloadResponse.readableStreamBody 
    ? mdnReadableStream_From_NodeReadableStream(downloadResponse.readableStreamBody)
    : undefined
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

export async function deleteImageBlob(blobname: string): Promise<Unit> {
  const blockBlobClient = images().getBlockBlobClient(blobname);

  await blockBlobClient.deleteIfExists()

  return Unit.done
}