import Button from "@/app/components/atoms/button";
import { Separator } from "@/app/components/atoms/separator";
import Title from "@/app/components/atoms/title";
import { getProducts } from "@/lib/azure/cosmos-client";
import { match } from "ts-pattern";
import { PackagePlus } from 'lucide-react'
import Link from 'next/link'
import Grid from "@/app/components/atoms/grid";
import ImageFrame from "@/app/components/atoms/image-frame";
import Image from "@/app/components/atoms/image";
import Space from "@/app/components/atoms/space";
import Large from "@/app/components/atoms/large";
import P from "@/app/components/atoms/p";

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
        .otherwise(() => 
          <>
            <Grid>
              {products.map((product, index) => (
                <div key={index}>
                  <ImageFrame>
                    <Image src={product.image} alt={product.image} />
                  </ImageFrame>
                  <Space className="space--top-1">
                    <Large>{product.name}</Large>
                    <P>{product.price} €</P>
                  </Space>
                </div>
              ))}
            </Grid>
          </>
        )}
    </>
  );
}

export default Page