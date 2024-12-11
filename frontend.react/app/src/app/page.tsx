import Title from "@/app/components/atoms/title";
import Grid from "@/app/components/atoms/grid";
import { withAzureDataAccess } from "@/lib/server";
import { getAllProducts } from "@/lib/server/core/products";
import { match, P } from "ts-pattern";
import Small from "@/app/components/atoms/small";
import Image from "@/app/components/atoms/image";
import { isFailure } from "@/lib/server/core/failure";
import ErrorPage from "@/app/components/layout/error-page";
import Header from "@/app/components/header";
import Main from "@/app/components/main";
import ImageFrame from "./components/atoms/image-frame";
import Space from "./components/atoms/space";

export default async function Home() {
  const products = await withAzureDataAccess(dataAccess => 
    getAllProducts(dataAccess)
  )
  
  return (
    <>
      <Header>
        <Title type="h1" >Naqab Bedouin Design</Title>
      </Header>
      <Main>
        {match(products)
          .with([], () => (
            <Small>
              Oeps, we hebben onze producten nog niet gedefinieerd. Kom later nog eens bij ons terug.
            </Small>
          ))
          .with(P.array() , (products) => (
            <Grid>
              {products.map((product, index) => (
                <div key={index}>
                  <ImageFrame>
                    <Image src={product.image} alt={product.name} />
                  </ImageFrame>
                  <div className="mt-2">
                    <Title type="h3">
                      {product.name}
                    </Title>
                    <Space>

                    </Space>
                    <p>
                      {product.price} €
                    </p>
                  </div>
                </div>
              ))}
            </Grid>
          ))
          .with(P.when(isFailure), (failure) => (
            <ErrorPage message={failure.reason} />
          ))
          .exhaustive()}
      </Main>
    </>
  )
}
