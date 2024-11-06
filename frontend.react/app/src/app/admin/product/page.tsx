import Button from "@/app/components/atoms/button";
import { Separator } from "@/app/components/atoms/separator";
import Title from "@/app/components/atoms/title";
import Products from "@/app/components/products";
import { getProducts } from "@/lib/azure/cosmos-client";
import { match } from "ts-pattern";
import { PackagePlus } from 'lucide-react'
import Link from 'next/link'

const Page = async () => {
  const products = await getProducts();

  return (
    <>
      <Title type="h3">beheer uw producten</Title>
      <Separator />
      {match(products)
        .with([], () => (
          <>
            <div>
              nog geen producten
            </div>
            <div>
              <Button>
                <Link href="/admin/product/create">
                  <PackagePlus />
                  creëer de eerste
                </Link>
              </Button>
            </div>
          </>
        ))
        .otherwise(() => <></>)}
      <Products items={products}></Products>
    </>
  );
}

export default Page