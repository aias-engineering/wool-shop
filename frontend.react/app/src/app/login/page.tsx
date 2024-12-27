import Grid from '@/app/components/atoms/grid'
import Logo from '@/app/components/atoms/logo'
import Title from '@/app/components/atoms/title'
import SuspensedSignIn from './sign-in'

export default async function Login() {
  return (
    <Grid className="grid-cols-1 lg:grid-cols-2 h-full">
      <div className="bg-black p-10">
        <Title type="h1" className="text-white">
          <Logo></Logo>
          Naqab Bedouin Design
        </Title>
      </div>
      <div className="bg-transparent flex flex-col justify-center mx-auto">
        <SuspensedSignIn />
      </div>
    </Grid>
  )
}
