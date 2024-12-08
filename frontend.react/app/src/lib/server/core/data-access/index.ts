import { Product } from '@/lib/server/core/types'
import { Unit } from '../types'
import {
  DownloadDidntReturnStream,
  ErrorInBlobStorageAccess,
  ErrorInCosmosDbAccess,
  ProductWithIdNotFound,
} from '../failure'
export * from './create-product'

export interface ReadAllProducts {
  readAllProducts(): Promise<Product[] | ErrorInCosmosDbAccess>
}

export interface ReadProductsWithImage {
  readProductsWithImage(
    imagename: string,
  ): Promise<Product[] | ErrorInCosmosDbAccess>
}

export interface ReadProduct {
  readProduct(
    id: string,
  ): Promise<Product | ProductWithIdNotFound | ErrorInCosmosDbAccess>
}

export interface DeleteProduct {
  deleteProduct(id: string): Promise<Unit | ErrorInCosmosDbAccess>
}

export interface ListImageBlobsFlat {
  listImageBlobsFlat(): Promise<string[] | ErrorInBlobStorageAccess>
}

export interface DownloadImageBlob {
  downloadImageBlob(
    imageBlobname: string,
  ): Promise<
    ReadableStream | DownloadDidntReturnStream | ErrorInBlobStorageAccess
  >
}

export interface UploadImageBlob {
  uploadImageBlob(
    imageBlobname: string,
    stream: ReadableStream,
  ): Promise<Unit | ErrorInBlobStorageAccess>
}

export interface DeleteImageBlob {
  deleteImageBlob(imagename: string): Promise<Unit | ErrorInBlobStorageAccess>
}

export type DataAccessFacade = ReadAllProducts &
  ReadProductsWithImage &
  ReadProduct &
  DeleteProduct &
  ListImageBlobsFlat &
  DownloadImageBlob &
  UploadImageBlob &
  DeleteImageBlob
