import { match } from "ts-pattern";
import { PostableImage } from "./store/image/post"; 
import { Failure, processFailureResponse, UnknownServerFailure } from "./failure";

const apiUrl = (imagename: string): string => `/api/image/${imagename}`

export const postImage = (image: PostableImage): Promise<string|Failure|UnknownServerFailure> => 
  fetch(apiUrl(image.name), { body: image.data, method: 'POST' })
    .then(async (response) => match(response)
      .with({ status: 200 }, (response) => 
        response.text()
          .then(imagename => apiUrl(imagename))
      )
      .with(
        { status: 500 }, 
        (response) => processFailureResponse(response)
      )
      .otherwise(async () => UnknownServerFailure())
    )
    .catch(() => UnknownServerFailure())