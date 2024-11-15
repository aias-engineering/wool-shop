import {
  DownloadDidntReturnStream,
  ErrorInBlobStorageAccess,
  ErrorInCosmosDbAccess,
  ImageReferencedByProducts,
} from './failure'
import {
  DeleteImageBlob,
  DownloadImageBlob,
  ListImageBlobsFlat,
  ReadProductsWithImage,
  UploadImageBlob,
} from './data-access'
import { match, P } from 'ts-pattern'
import { Product, Unit } from './types'

export const getImages = (
  dataAccess: ListImageBlobsFlat,
): Promise<ErrorInBlobStorageAccess | string[]> =>
  dataAccess.listImageBlobsFlat()

export const getImage = (
  imagename: string,
  dataAccess: DownloadImageBlob,
): Promise<
  ErrorInBlobStorageAccess | ReadableStream<any> | DownloadDidntReturnStream
> => dataAccess.downloadImageBlob(imagename)

export const saveImage = (
  imagename: string,
  stream: ReadableStream,
  dataAccess: UploadImageBlob,
): Promise<Unit | ErrorInBlobStorageAccess> =>
  dataAccess.uploadImageBlob(imagename, stream)

export const deleteImage = (
  imagename: string,
  dataAccess: ReadProductsWithImage & DeleteImageBlob,
): Promise<
  | Unit
  | ErrorInCosmosDbAccess
  | ErrorInBlobStorageAccess
  | ImageReferencedByProducts
> =>
  dataAccess
    .readProductsWithImage(imagename)
    .then((either) =>
      match(either)
        .with([], () => imagename)
        .with(
          P.array(),
          (products: Product[]) =>
            new ImageReferencedByProducts(products.map((x) => x.name)),
        )
        .with(P.instanceOf(ErrorInCosmosDbAccess), (failure) => failure)
        .exhaustive(),
    )
    .then(async (either) =>
      typeof either === 'string'
        ? await dataAccess.deleteImageBlob(either)
        : either,
    )
    .catch((err) => new ErrorInBlobStorageAccess(err))
