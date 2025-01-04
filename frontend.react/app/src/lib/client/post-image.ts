import { match, P } from "ts-pattern";
import { PostableImage } from "./store/image/post"; 
import { processFailureResponse, ServerFailure, UnknownServerFailure } from "./failure";

const apiUrl = (imagename: string): string => `/api/image/${imagename}`

export const postImage = (image: PostableImage): Promise<string|ServerFailure|UnknownServerFailure> => 
  fetch(apiUrl(image.name), { body: image.data, method: 'POST' })
    .then(async (response) => match(response)
      .with({ status: 200 }, async () => apiUrl(image.name))
      .with(
        { status: 500 }, 
        (response) => processFailureResponse(response))
      .otherwise(async () => UnknownServerFailure())
    )
    .catch(() => UnknownServerFailure())