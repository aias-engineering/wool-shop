import { getProducts } from "@/lib/azure/cosmos-client";

export async function GET(): Promise<Response> {
  const products = await getProducts();
  return Response.json(products)
}