import { images } from './blob-store-client'
import {
  mdnReadableStream_From_NodeReadableStream,
  nodeReadable_From_MdnReadableStream,
} from '@/lib/streams'
import {
  DownloadDidntReturnStream,
  ErrorInBlobStorageAccess,
} from '@/lib/server/core/failure'
import { Unit } from '@/lib/server/core/types'

export async function listImageBlobsFlat(): Promise<
  string[] | ErrorInBlobStorageAccess
> {
  try {
    let imagenames: string[] = []

    for await (const blob of images().listBlobsFlat()) {
      imagenames = [...imagenames, blob.name]
    }
    return imagenames
  } catch (error) {
    return ErrorInBlobStorageAccess(error as TypeError)
  }
}

export const downloadImageBlob = (
  blobname: string,
): Promise<
  ReadableStream | DownloadDidntReturnStream | ErrorInBlobStorageAccess
> =>
  images()
    .getBlockBlobClient(blobname)
    .download()
    .then(
      (response) =>
        response.readableStreamBody
          ? mdnReadableStream_From_NodeReadableStream(
              response.readableStreamBody,
            )
          : DownloadDidntReturnStream(blobname),
      (error) => ErrorInBlobStorageAccess(error),
    )

export const uploadImageBlob = (
  blobname: string,
  stream: ReadableStream,
): Promise<Unit | ErrorInBlobStorageAccess> =>
  images()
    .getBlockBlobClient(blobname)
    .uploadStream(nodeReadable_From_MdnReadableStream(stream))
    .then(
      () => Unit.done,
      (error) => ErrorInBlobStorageAccess(error),
    )

export const deleteImageBlob = (
  blobname: string,
): Promise<Unit | ErrorInBlobStorageAccess> =>
  images()
    .getBlockBlobClient(blobname)
    .deleteIfExists()
    .then(
      () => Unit.done,
      (err) => ErrorInBlobStorageAccess(err),
    )
