import CurrencyInput from '@/app/components/atoms/currency-input'
import Input, { toId } from '@/app/components/atoms/input'
import Label from '@/app/components/atoms/label'
import Textarea from '@/app/components/atoms/textarea'
import Title from '@/app/components/atoms/title'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/molecules/card'
import { HasChildren } from '@/lib/client/react'
import { Product } from '@/lib/server/core/products'
import { match } from 'ts-pattern'

export type ProductInfoState =
  | 'hide'
  | 'idle'
  | { state: 'preloaded'; product: Product }

interface Props extends HasChildren {
  name: 'infoNl' | 'infoEn'
  pending: boolean
  productInfoState: ProductInfoState
  title: string
}

export function ProductInfoCard({
  children,
  name,
  pending,
  productInfoState,
  title,
}: Props) {
  return (
    <>
      {match(productInfoState)
        .with('hide', () => <></>)
        .with('idle', () => (
          <Card>
            <CardHeader>
              <CardTitle>
                <Title type="h4">{title}</Title>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor={toId(`${name}.name`)}>naam</Label>
              <Input
                name={`${name}.name`}
                type="text"
                required
                disabled={pending}
              />
              <Label htmlFor={toId(`${name}.description`)}>beschrijving</Label>
              <Textarea
                name={`${name}.description`}
                disabled={pending}
              ></Textarea>
              <Label htmlFor={toId(`${name}.price`)}>prijs</Label>
              <CurrencyInput
                name={`${name}.price`}
                currency={name === 'infoEn' ? 'dollar' : 'euro'}
                disabled={pending}
              />
            </CardContent>
            <CardFooter className="flex flex-row justify-end gap-2">
              {children}
            </CardFooter>
          </Card>
        ))
        .with({ state: 'preloaded' }, ({ product }) => (
          <Card>
            <CardHeader>
              <CardTitle>
                <Title type="h4">{title}</Title>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor={toId('id')}>id</Label>
              <span>{product.id}</span>
              <Input
                name="id"
                type="hidden"
                defaultValue={product.id}
                required
              />
              <Label htmlFor={toId(`${name}.name`)}>naam</Label>
              <Input
                name={`${name}.name`}
                type="text"
                disabled={pending}
                defaultValue={product[name]?.name}
                required
              />
              <Label htmlFor={toId(`${name}.description`)}>beschrijving</Label>
              <Textarea
                name={`${name}.description`}
                defaultValue={product[name]?.description || undefined}
                disabled={pending}
              ></Textarea>
              <Label htmlFor={toId(`${name}.price`)}>prijs in euro</Label>
              <CurrencyInput
                name={`${name}.price`}
                defaultValue={product[name]?.price}
              />
            </CardContent>
            <CardFooter className="flex flex-row justify-end gap-2">
              {children}
            </CardFooter>
          </Card>
        ))
        .exhaustive()}
    </>
  )
}
