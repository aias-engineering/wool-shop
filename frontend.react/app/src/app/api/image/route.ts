import * as azure from "@/lib/server/boundary/azure/images-client";
import { ErrorInBlobStorageAccess } from "@/lib/server/core/failure";
import { getImages } from "@/lib/server/core/service";
import { NextResponse } from "next/server";
import { match, P } from "ts-pattern";

export async function GET(): Promise<NextResponse> {

  const listImagesResult = await getImages(azure.listImages)

  return match<ErrorInBlobStorageAccess|string[], NextResponse>(listImagesResult)
    .with(P.array(), (imagenames) => NextResponse.json(imagenames))
    .with(P.instanceOf(ErrorInBlobStorageAccess), ({reason}) => new NextResponse(reason, {status: 500}))
    .exhaustive()
}