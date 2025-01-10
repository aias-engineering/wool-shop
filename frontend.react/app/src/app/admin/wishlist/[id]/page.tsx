import Title from "@/app/components/atoms/title";
import { AdminMain } from "@/app/components/layout/admin";
import AdminErrorPage from "@/app/components/layout/admin/error-page";
import AdminHeaderLayout from "@/app/components/layout/admin/header";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/app/components/molecules/table";
import { HasId, PromisesParams } from "@/lib/client/react";
import { withAzureDataAccess } from "@/lib/server";
import { isFailure } from "@/lib/server/core/failure";
import { calculatePositionPrice, calculateTotal, getWishlist, isWishlist } from "@/lib/server/core/wishlists";
import { match, P } from "ts-pattern";

export default async function Page({params}: PromisesParams<HasId>) {
  const { id } = await params
  const eitherWishlistOrFailure = await withAzureDataAccess(dataAccess => 
    getWishlist(id, dataAccess)
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead >amount</TableHead>
                    <TableHead>name</TableHead>
                    <TableHead>
                      price
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wishlist.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        {item.amount}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.price} €
                      </TableCell>
                      <TableCell>
                        {calculatePositionPrice(item)} €
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell>Total</TableCell>
                    <TableCell>{calculateTotal(wishlist.items)} €</TableCell>
                  </TableRow>
                </TableFooter>
              </Table></>
          ))
          .with(P.when(isFailure), (failure) => (
            <AdminErrorPage failure={failure} />
          ))
          .exhaustive()}
      </AdminMain>
    </>
  )
}