import Products from "@/app/components/products";
import { getProducts } from "@/lib/azure/cosmos-client";

const Page = async () => {
    const products = await getProducts();

  return (
    <>
      <Products items={products}></Products>
    </>
  );
}

export default Page