import { DeleteImageBlob, DownloadImageBlob, ListImageBlobsFlat, UploadImageBlob } from "@/lib/server/core/data-access"
import { DownloadDidntReturnStream, ErrorInBlobStorageAccess } from "@/lib/server/core/failure"
import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { nodeReadable_From_MdnReadableStream } from "@/lib/streams"
import { ReadStream } from "fs"
import { Unit } from "../../core/types"
dotenv.config()

function imageKit() {
  return new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE || '',
    publicKey: process.env.IMAGEKIT_PUBLIC || '',
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT || ''
  })
}

const listImageBlobsFlat = (): Promise<string[] | ErrorInBlobStorageAccess> => 
  imageKit()
    .listFiles({ fileType: "image" })
    .then(response => response.map(x => x.name))
    .catch(error => ErrorInBlobStorageAccess(error))

const downloadImageBlob = (blobname: string): Promise<ReadableStream | DownloadDidntReturnStream | ErrorInBlobStorageAccess> =>
  {
  const url = imageKit()
    .url({
      path: `/${blobname}`,
      transformation: [{ width: 2560, height: 3840 }]
    })
    console.log('url: %s', url)
    return fetch(url, { cache: "no-cache" })
      .then(response => response.body
        ? response.body
        : DownloadDidntReturnStream(blobname)
      )
      .catch(error => ErrorInBlobStorageAccess(error))
  }

const uploadImageBlob = (blobname: string, stream: ReadableStream)
    : Promise<string|ErrorInBlobStorageAccess> =>
  {
    return imageKit()
      .upload({
        file: nodeReadable_From_MdnReadableStream(stream) as ReadStream,
        fileName: blobname
      })
      .then(response => response.name)
      .catch(error => ErrorInBlobStorageAccess(error))
  }

const deleteImageBlob = async (blobname: string): Promise<Unit | ErrorInBlobStorageAccess> =>
  ErrorInBlobStorageAccess({message: 'deleteImageBlob is not supported', name: 'not-supported-error'})

const imagesClient: ListImageBlobsFlat &
  DownloadImageBlob &
  UploadImageBlob &
  DeleteImageBlob = {
  listImageBlobsFlat,
  downloadImageBlob,
  uploadImageBlob,
  deleteImageBlob
 }

export default imagesClient