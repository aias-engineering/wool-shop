import { getProduct } from "@/lib/azure/cosmos-client";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  console.log('/product/%s', params.id)
  const product = await getProduct(params.id)
  if (product)
    return Response.json(product)
  return new Response('Not Found', { status: 404 })
}