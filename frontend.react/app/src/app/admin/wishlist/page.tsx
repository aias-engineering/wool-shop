import Paragraph from '@/app/components/atoms/paragraph'
import Title from '@/app/components/atoms/title'
import AdminErrorPage from '@/app/components/layout/admin-error-page'
import HeaderLayout from '@/app/components/layout/header'
import Main from '@/app/components/main'
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
import { getAllWishlists } from '@/lib/server/core/wishlists'
import { match, P } from 'ts-pattern'

export default async function Page() {
  const eitherWishlistsOrError = await withAzureDataAccess((dataAccess) =>
    getAllWishlists(dataAccess),
  )

  return (
    <>
      <HeaderLayout>
        <Title type="h2">AdminUI</Title>
      </HeaderLayout>
      <Main>
        <Title type="h3">Wensenlijstjes</Title>
        {match(eitherWishlistsOrError)
          .with([], () => (
            <>
              <Paragraph>er zijn nog geen verlanglijstjes</Paragraph>
              <Paragraph>sorry</Paragraph>
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
                      <TableCell>
                        {wishlist.items.reduce(
                          (prev, item) => prev + item.price,
                          0.0,
                        )}{' '}
                        €
                      </TableCell>
                      <TableCell>
                        {wishlist.submitDate.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ))
          .with(P.when(isErrorInCosmosDbAccess), (failure) => (
            <AdminErrorPage code={failure.code} reason={failure.code} />
          ))
          .exhaustive()}
      </Main>
    </>
  )
}
