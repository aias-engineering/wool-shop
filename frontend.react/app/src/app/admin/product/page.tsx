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
import P from '@/app/components/atoms/p'
import { withAzureDataAccess } from '@/lib/server'
import { getAllProducts } from '@/lib/server/core/products'
import { isFailure } from '@/lib/server/core/failure'
import ErrorPage from '@/app/components/layout/error-page'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/molecules/card'
import DeleteProductButton from './delete-button'

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
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageFrame>
                      <Image src={product.image} alt={product.image} />
                    </ImageFrame>
                    <Space className="space--top-1">
                      <P>{product.price} €</P>
                    </Space>
                  </CardContent>
                  <CardFooter>
                    <DeleteProductButton productId={product.id} />
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          </>
        ))
        .with(ts.P.when(isFailure), (error) => (
          <ErrorPage
            message={`${error.code}: ${error.reason}
            
             ${error.error}`}
          />
        ))
        .exhaustive()}
    </>
  )
}

export default Page
