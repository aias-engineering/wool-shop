import Button from '@/app/components/atoms/button'
import Grid from '@/app/components/atoms/grid'
import Input from '@/app/components/atoms/input'
import Logo from '@/app/components/atoms/logo'
import Paragraph from '@/app/components/atoms/paragraph'
import Title from "@/app/components/atoms/title"

export default async function Login() {
  return (
    <Grid className='grid-cols-1 lg:grid-cols-2 h-full'>
        <div className='bg-black p-10'>
          <Title type="h1" className='text-white'>
            <Logo></Logo>
            Naqab Bedouin Design
          </Title>
        </div>
        <div className='bg-transparent flex flex-col justify-center mx-auto'>
          <div className='text-center space-y-2'>
            <Title type='h2' className='border-b-0'>een account aanmaken</Title>
            <Paragraph>Voer hieronder uw e-mailadres in om uw account aan te maken</Paragraph>
          </div>
          <form>
              <div className='pt-6 grid gap-1'>
                <Input name='email' type='email' placeholder='name@example.com'></Input>
                <Button>aanmelden met e-mail</Button>
              </div>
            </form>
        </div>
      </Grid>
  )
}