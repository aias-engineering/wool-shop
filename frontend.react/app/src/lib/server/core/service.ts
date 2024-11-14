import { Product, Unit } from "./types";
import { DownloadDidntReturnStream, ErrorInBlobStorageAccess, ErrorInCosmosDbAccess, Failure, ImageReferencedByProducts } from "./failure";
import { match } from "ts-pattern";

export async function getImages(listImageBlobsFlat: () => Promise<string[]>)
  : Promise<string[] | ErrorInBlobStorageAccess> {

    return listImageBlobsFlat()
      .catch(err => new ErrorInBlobStorageAccess(err))
}

export async function getImage(
  imagename: string, 
  downloadImageBlob: (blobname: string) => Promise<ReadableStream | undefined>)
  : Promise<ReadableStream<any> | DownloadDidntReturnStream | ErrorInBlobStorageAccess> {

    return downloadImageBlob(imagename)
      .then(either => either || new DownloadDidntReturnStream(imagename))
      .catch(err => new ErrorInBlobStorageAccess(err))
}

export async function deleteImage(
  id: string,
  readProductsWithImage: (id: string) => Promise<Product[]>,
  deleteImageBlob: (id: string) => Promise<Unit>)
  : Promise<Unit | ImageReferencedByProducts | Failure>  {

    return readProductsWithImage(id)
      .then(  
        products => ValidateDeletionPossible(id, products),
        err => new ErrorInCosmosDbAccess(err))
      .then(
        async (either) => typeof(either) === 'string' 
            ? await deleteImageBlob(either)
            : either
      )
      .catch(err => new ErrorInBlobStorageAccess(err))
}

function ValidateDeletionPossible(id: string, products: Product[]): string | ImageReferencedByProducts {
  return match(products)
      .with([], () => id)
      .otherwise(() => new ImageReferencedByProducts(products.map(x => x.name)))
}