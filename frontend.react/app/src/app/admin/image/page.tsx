import { Provider } from "jotai"
import PreloadedImagesGrid from "./preloaded-image-grid"
import { toUrls } from "@/lib/client/store/image"
import Title from "@/app/components/atoms/title"
import { Separator } from "@/app/components/atoms/separator"
import { listImages } from "@/lib/server/boundary/azure/blob-store-client"
import { match } from "ts-pattern"
import { ListImagesResult } from "@/lib/server/core/types"
import ErrorPage from "@/app/components/layout/error-page"

export default async function Page() {
  const listImagesResult = await listImages()

  return (
    <>
      {match<ListImagesResult, JSX.Element>(listImagesResult)
        .with({state: 'success'}, ({imagenames}) => (
          <>
            <Provider>
              <Title type="h3">jouw afbeeldingen</Title>
              <Separator orientation="horizontal" />
              <PreloadedImagesGrid urls={toUrls(imagenames)} />
            </Provider>
          </>))
          .with({state: 'failure'}, ({message}) => <ErrorPage message={message} />)
        .exhaustive()}
    </>
  )
}