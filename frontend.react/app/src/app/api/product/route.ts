import { IProduct, createProduct } from "@/lib/azure/cosmos-client";
import { getProducts } from "@/lib/local-db"

export async function GET() {
  const products = await getProducts();
  return Response.json(products)
}

export async function POST(request: Request) {
  const product = await request.json() as IProduct
  await createProduct(product)
}