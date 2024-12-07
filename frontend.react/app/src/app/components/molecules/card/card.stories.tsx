import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '.'

export default {
  title: 'molecules/card',
  component: Card,
}

export function DefaultCard() {
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
      </CardHeader>
      <CardContent>
        There could be your text here.
      </CardContent>
      <CardFooter>
        And here your footer.
      </CardFooter>
    </Card>
  )
}

export function CardWithHoverFooter() {
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Card with hover</CardTitle>
      </CardHeader>
      <CardContent>
        There could be your text here.
      </CardContent>
      <CardFooter className='card__footer--onhover'>
        And this footer only is visible on hover
      </CardFooter>
    </Card>
  )
}