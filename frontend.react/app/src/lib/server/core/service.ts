import { match, P } from "ts-pattern";
import { DeleteImageBlobResult, DeleteImageResult, ReadProductsResult } from "./types";

export async function deleteImage(
  readProductsWithImagePromise: Promise<ReadProductsResult>,
  deleteImageBlobPromise: Promise<DeleteImageBlobResult>): Promise<DeleteImageResult> {

    const readProductsWithImageResult = await readProductsWithImagePromise;

    return await match<ReadProductsResult, Promise<DeleteImageResult>>(readProductsWithImageResult)
      .with({state: 'success', products: []}, async () => {
        const deleteImageBlobResult = await deleteImageBlobPromise
        return match<DeleteImageBlobResult, DeleteImageResult>(deleteImageBlobResult)
          .with({state: 'success'}, () => ({ state: 'success' }))
          .with({state: 'failure'}, ({message}) => ({ state: 'failure', message }))
          .exhaustive()
      })
      .with({state: 'success', products: P.not([])}, async ({products}) => ({ state: "referenced-by-products", products }))
      .with({state: 'failure'}, async ({message}) => ({state: 'failure', message }))
      .exhaustive()
}