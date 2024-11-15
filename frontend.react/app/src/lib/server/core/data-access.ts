import { Product } from "@/lib/azure/entities"
import { Unit } from "./types"
import * as azureBlobClient from '@/lib/server/boundary/azure/images-client'
import * as azureCosmosClient from '@/lib/server/boundary/azure/products-client'
import { DownloadDidntReturnStream, ErrorInBlobStorageAccess, ErrorInCosmosDbAccess } from "./failure"

export interface ReadProductsWithImage {
  readProductsWithImage(imagename: string): Promise<Product[]|ErrorInCosmosDbAccess>
}

export interface ListImageBlobsFlat {
  listImageBlobsFlat(): Promise<string[]|ErrorInBlobStorageAccess>
}

export interface DownloadImageBlob {
  downloadImageBlob(imageBlobname: string): Promise<ReadableStream|DownloadDidntReturnStream|ErrorInBlobStorageAccess>
}

export interface UploadImageBlob {
  uploadImageBlob(imageBlobname: string, stream: ReadableStream): Promise<Unit|ErrorInBlobStorageAccess>
}

export interface DeleteImageBlob {
  deleteImageBlob(imagename: string): Promise<Unit|ErrorInBlobStorageAccess>
}

export type DataAccessFacade = 
  & ReadProductsWithImage 
  & ListImageBlobsFlat
  & DownloadImageBlob
  & UploadImageBlob
  & DeleteImageBlob

export async function withAzureDataAccess<R>(func: (dataAccess: DataAccessFacade) => Promise<R>) {
  const azureClient: DataAccessFacade = {...azureBlobClient, ...azureCosmosClient}
  return func(azureClient)
}