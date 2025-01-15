import Paragraph from '@/app/components/atoms/paragraph'
import { Separator } from '@/app/components/atoms/separator'
import Title from '@/app/components/atoms/title'
import { AdminMain } from '@/app/components/layout/admin'
import AdminErrorPage from '@/app/components/layout/admin/error-page'
import AdminHeaderLayout from '@/app/components/layout/admin/header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/molecules/table'
import { withAzureDataAccess } from '@/lib/server'
import { isErrorInCosmosDbAccess } from '@/lib/server/core/failure'
import { calculateTotal, getAllWishlists } from '@/lib/server/core/wishlists'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import { match, P } from 'ts-pattern'

export default async function Page() {
  const eitherWishlistsOrError = await withAzureDataAccess((dataAccess) =>
    getAllWishlists(dataAccess),
  )

  return (
    <>
      <AdminHeaderLayout></AdminHeaderLayout>
      <AdminMain>
        <div className="py-4 pr-2 w-full">
          <Title type="h3">Wensenlijstjes</Title>
        </div>
        <Separator className="my-4" />
        {match(eitherWishlistsOrError)
          .with([], () => (
            <>
              <Paragraph>sorry, er zijn nog geen verlanglijstjes</Paragraph>
            </>
          ))
          .with(P.array(), (wishlists) => (
            <>
              <Paragraph>
                dit zijn alle wensenlijstjes die bij ons zijn ingediend
              </Paragraph>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:table-cell">id</TableHead>
                    <TableHead>email</TableHead>
                    <TableHead className="hidden md:table-cell">
                      items
                    </TableHead>
                    <TableHead>sum</TableHead>
                    <TableHead>date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wishlists.map((wishlist) => (
                    <TableRow key={wishlist.id}>
                      <TableCell className="hidden md:table-cell">
                        {wishlist.id}
                      </TableCell>
                      <TableCell>{wishlist.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {wishlist.items.length}
                      </TableCell>
                      <TableCell>{calculateTotal(wishlist.items)} €</TableCell>
                      <TableCell>{wishlist.submitDate.toUTCString()}</TableCell>
                      <TableCell>
                        <Link href={`/admin/wishlist/${wishlist.id}`}>
                          <MoveRight />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ))
          .with(P.when(isErrorInCosmosDbAccess), (failure) => (
            <AdminErrorPage failure={failure} />
          ))
          .exhaustive()}
      </AdminMain>
    </>
  )
}
