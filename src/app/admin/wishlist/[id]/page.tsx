import Grid from '@/app/components/atoms/grid'
import Paragraph from '@/app/components/atoms/paragraph'
import Title from '@/app/components/atoms/title'
import { AdminMain } from '@/app/components/layout/admin'
import AdminErrorPage from '@/app/components/layout/admin/error-page'
import AdminHeaderLayout from '@/app/components/layout/admin/header'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/molecules/table'
import { HasId, PromisesParams } from '@/lib/client/react'
import { withAzureDataAccess } from '@/lib/server'
import { isFailure } from '@/lib/server/core/failure'
import { getCurrency } from '@/lib/server/core/products'
import {
  calculatePositionPrice,
  calculateTotal,
  getWishlist,
  isWishlist,
} from '@/lib/server/core/wishlists'
import { match, P } from 'ts-pattern'

export default async function Page({ params }: PromisesParams<HasId>) {
  const { id } = await params
  const eitherWishlistOrFailure = await withAzureDataAccess((dataAccess) =>
    getWishlist(id, dataAccess),
  )

  return (
    <>
      <AdminHeaderLayout></AdminHeaderLayout>
      <AdminMain>
        {match(eitherWishlistOrFailure)
          .with(P.when(isWishlist), (wishlist) => (
            <>
              <div className="py-4 pr-2 w-full">
                <Title type="h3">Wishlist {wishlist.id}</Title>
              </div>
              <Grid className="grid-cols-2 grid-cols-[20%_80%]">
                <Paragraph>email</Paragraph>
                <Paragraph>{wishlist.email}</Paragraph>
                <Paragraph>date</Paragraph>
                <Paragraph>{wishlist.submitDate.toUTCString()}</Paragraph>
              </Grid>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>amount</TableHead>
                    <TableHead>name</TableHead>
                    <TableHead>price</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wishlist.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.price.toFixed(2)} {getCurrency(wishlist.locale)}
                      </TableCell>
                      <TableCell>
                        {calculatePositionPrice(item).toFixed(2)}{' '}
                        {getCurrency(wishlist.locale)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="font-bold">
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell>Total</TableCell>
                    <TableCell>
                      {calculateTotal(wishlist.items).toFixed(2)}{' '}
                      {getCurrency(wishlist.locale)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          ))
          .with(P.when(isFailure), (failure) => (
            <AdminErrorPage failure={failure} />
          ))
          .exhaustive()}
      </AdminMain>
    </>
  )
}
