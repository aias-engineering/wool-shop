import { Unit } from '@/lib/server/core/types'
import {
  DownloadDidntReturnStream,
  ErrorInBlobStorageAccess,
  ErrorInCosmosDbAccess,
  MultipleUsersWithEmailFound,
  UserWithEmailNotFound,
} from '../failure'
import { CreateProduct } from './create-product'
import { CreateUser } from './create-user'
import { User } from '../users'
import { UserWithIdNotFound } from '../users/failure'
import { CreateAccount, ReadAccountsByProviderAccount } from './accounts'
import {
  ReadAllProducts,
  ReadProduct,
  ReadProductsWithImage,
  DeleteProduct,
  UpsertProduct,
} from './products'
import { CreateSession, DeleteSession, ReadSessionsByToken } from './sessions'
import { CreateWishlist, ReadAllWishlists, ReadWishlist } from './wishlists'
export * from './create-product'
export * from './create-user'
export {
  type CreateAccount,
  type CreateAccountRequest,
  type CreateAccountResponse,
} from './accounts'
export {
  type ReadAllProducts,
  type ReadProduct,
  type ReadProductsWithImage,
  type DeleteProduct,
} from './products'
export {
  type CreateSession,
  type CreateSessionRequest,
  type CreateSessionResponse,
} from './sessions'

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
  ): Promise<string | ErrorInBlobStorageAccess>
}

export interface DeleteImageBlob {
  deleteImageBlob(imagename: string): Promise<Unit | ErrorInBlobStorageAccess>
}

export interface ReadUser {
  readUser(
    id: string,
  ): Promise<User | UserWithIdNotFound | ErrorInCosmosDbAccess>
}

export interface ReadUserWithEmail {
  readUserWithEmail(
    email: string,
  ): Promise<
    | User
    | UserWithEmailNotFound
    | MultipleUsersWithEmailFound
    | ErrorInCosmosDbAccess
  >
}

export type DataAccessFacade = ReadAllProducts &
  ReadProductsWithImage &
  ReadProduct &
  DeleteProduct &
  CreateProduct &
  UpsertProduct &
  ListImageBlobsFlat &
  DownloadImageBlob &
  UploadImageBlob &
  DeleteImageBlob &
  ReadUser &
  ReadUserWithEmail &
  CreateUser &
  ReadAccountsByProviderAccount &
  CreateAccount &
  ReadSessionsByToken &
  CreateSession &
  DeleteSession &
  ReadAllWishlists &
  ReadWishlist &
  CreateWishlist
