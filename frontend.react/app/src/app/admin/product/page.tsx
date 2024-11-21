import Button from '@/app/components/atoms/button'
import { Separator } from '@/app/components/atoms/separator'
import Title from '@/app/components/atoms/title'
import * as ts from 'ts-pattern'
import { PackagePlus } from 'lucide-react'
import Link from 'next/link'
import Grid from '@/app/components/atoms/grid'
import ImageFrame from '@/app/components/atoms/image-frame'
import Image from '@/app/components/atoms/image'
import Space from '@/app/components/atoms/space'
import Large from '@/app/components/atoms/large'
import P from '@/app/components/atoms/p'
import { withAzureDataAccess } from '@/lib/server/core/data-access'
import { getAllProducts } from '@/lib/server/core/products'
import { ErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import ErrorPage from '@/app/components/layout/error-page'

const Page = async () => {
  const products = await withAzureDataAccess((dataAccess) =>
    getAllProducts(dataAccess),
  )

  return (
    <>
      <Title type="h3">beheer uw producten</Title>
      <Separator />
      {ts
        .match(products)
        .with([], () => (
          <>
            <div>nog geen producten</div>
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
        .with(ts.P.array(), (products) => (
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
        ))
        .with(ts.P.instanceOf(ErrorInCosmosDbAccess), (error) => (
          <ErrorPage message={error.code} />
        ))
        .exhaustive()}
    </>
  )
}

export default Page
