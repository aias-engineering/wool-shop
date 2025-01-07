import ErrorPage from '@/app/components/layout/error-page'
import { withAzureDataAccess } from '@/lib/server'
import { Failure, isFailure } from '@/lib/server/core/failure'
import { getProduct, Product } from '@/lib/server/core/products'
import { EditProduct } from './edit-product'
import HeaderLayout from '@/app/components/layout/header'
import Title from '@/app/components/atoms/title'
import Main from '@/app/components/main'


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const eitherProductOrFailure = 
    await params
      .then(
        ({id}) => withAzureDataAccess(
          dataAccess => getProduct(id, dataAccess)))

  if (isFailure(eitherProductOrFailure)) {
    const failure: Failure = eitherProductOrFailure
    return (<ErrorPage message={failure.code} />)
  }
  
  const product: Product = eitherProductOrFailure

  return (
    <>
      <HeaderLayout>
        <Title type="h2" className="text-white">
          Admin UI
        </Title>
      </HeaderLayout>
      <Main>
        <EditProduct product={product} />
      </Main>
    </>
  )
}
