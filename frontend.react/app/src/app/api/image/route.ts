import { listImages } from "@/lib/server/boundary/azure/blob-store-client";
import { ListImagesResult } from "@/lib/server/core/types";
import { NextRequest, NextResponse } from "next/server";
import { match } from "ts-pattern";

export async function GET(_: NextRequest): Promise<NextResponse> {

  const listImagesResult = await listImages()

  return match<ListImagesResult, NextResponse>(listImagesResult)
    .with({state: 'success'}, ({imagenames}) => NextResponse.json(imagenames))
    .with({state: 'failure'}, ({message}) => new NextResponse(message, {status: 500}))
    .exhaustive()
}