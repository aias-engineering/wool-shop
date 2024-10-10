import Products from "@/app/components/products";
import { getProducts } from "@/lib/local-db";

const Page = async () => {
    const products = await getProducts();

  return (
    <>
      <Products items={products}></Products>
    </>
  );
}

export default Page