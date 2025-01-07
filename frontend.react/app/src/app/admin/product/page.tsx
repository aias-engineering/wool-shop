import Button from '@/app/components/atoms/button'
import { Separator } from '@/app/components/atoms/separator'
import Title from '@/app/components/atoms/title'
import * as ts from 'ts-pattern'
import { PackagePlus, Pencil } from 'lucide-react'
import Link from 'next/link'
import Grid from '@/app/components/atoms/grid'
import ImageFrame from '@/app/components/atoms/image-frame'
import Image from 'next/image'
import Space from '@/app/components/atoms/space'
import Paragraph from '@/app/components/atoms/paragraph'
import { withAzureDataAccess } from '@/lib/server'
import { getAllProducts } from '@/lib/server/core/products'
import { isFailure } from '@/lib/server/core/failure'
import ErrorPage from '@/app/components/layout/error-page'
import HeaderLayout from '@/app/components/layout/header'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/molecules/card'
import DeleteProductButton from './delete-button'
import Main from '@/app/components/main'

const Page = async () => {
  const products = await withAzureDataAccess((dataAccess) =>
    getAllProducts(dataAccess),
  )

  return (
    <>
      <HeaderLayout>
        <Title type="h2" className="text-white">
          AdminUI
        </Title>
      </HeaderLayout>
      <Main>
        <Title type="h3">beheer uw producten</Title>
        <Separator />
        {ts
          .match(products)
          .with([], () => (
            <>
              <div>nog geen producten</div>
              <div>
                <Link href="/admin/product/create">
                  <Button>
                    <PackagePlus />
                    creëer de eerste
                  </Button>
                </Link>
              </div>
            </>
          ))
          .with(ts.P.array(), (products) => (
            <>
              <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {products.map((product, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ImageFrame>
                        <Image
                          src={product.image}
                          alt={product.name}
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          width={200}
                          height={300}
                          className="w-full"
                        />
                      </ImageFrame>
                      <Space className="space--top-1">
                        <Paragraph>{product.price} €</Paragraph>
                      </Space>
                    </CardContent>
                    <CardFooter className="gap-1">
                      <Link href={`/admin/product/edit/${product.id}`}>
                        <Button>
                          <Pencil /> bewerken
                        </Button>
                      </Link>
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
      </Main>
    </>
  )
}

export default Page
