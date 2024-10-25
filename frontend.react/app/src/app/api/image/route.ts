import { getImages } from "@/lib/services/images";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  const imageIndex = await getImages()
  return NextResponse.json(imageIndex)
}