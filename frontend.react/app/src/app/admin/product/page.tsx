import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import ImageFrame from '@/app/components/atoms/image-frame'
import Paragraph from '@/app/components/atoms/paragraph'
import Space from '@/app/components/atoms/space'
import Title from '@/app/components/atoms/title'
import { AdminMain } from '@/app/components/layout/admin'
import AdminErrorPage from '@/app/components/layout/admin/error-page'
import AdminHeaderLayout from '@/app/components/layout/admin/header'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getAllProducts } from '@/lib/server/core/products'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/molecules/card'
import { CirclePlus, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as ts from 'ts-pattern'
import DeleteProductButton from './delete-button'
import { Separator } from '@/app/components/atoms/separator'

const Page = async () => {
  const products = await withAzureDataAccess((dataAccess) =>
    getAllProducts(dataAccess),
  )

  return (
    <>
      <AdminHeaderLayout></AdminHeaderLayout>
      <AdminMain>
        <>
          <div className="grid grid-cols-2 py-4 pr-2">
            <Title type="h3">Producten</Title>
            <Link href={'/admin/product/create'} className="justify-self-end">
              <Button type="button">
                <CirclePlus />
                creëer en product
              </Button>
            </Link>
            <Paragraph>beheer uw producten</Paragraph>
          </div>
          <Separator className="my-4" />
          <div>
            {ts
              .match(products)
              .with([], () => (
                <>
                  <div>nog geen producten</div>
                </>
              ))
              .with(ts.P.array(), (products) => (
                <>
                  <Grid className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-2">
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
                              sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                              width={200}
                              height={300}
                              className="w-full"
                            />
                          </ImageFrame>
                          <Space className="space--top-1">
                            <Paragraph>{product.price} €</Paragraph>
                          </Space>
                        </CardContent>
                        <CardFooter className="flex-col justify-center xl:flex-row xl:items-center gap-1">
                          <Link href={`/admin/product/edit/${product.id}`} className='w-full'>
                            <Button type='button' className='w-full'>
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
                <AdminErrorPage failure={error} />
              ))
              .exhaustive()}
          </div>
        </>
      </AdminMain>
    </>
  )
}

export default Page
