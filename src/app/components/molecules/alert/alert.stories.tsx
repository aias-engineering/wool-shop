import { AlertCircle, Terminal } from 'lucide-react'
import Alert, { AlertDescription, AlertTitle } from '.'

export default {
  title: 'molecules/alert',
  component: Alert,
}

export function HeadsUp() {
  return (
    <Alert>
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can upload images!</AlertDescription>
    </Alert>
  )
}

export function Error() {
  return (
    <Alert className="alert--destructive">
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>An exception was thrown!</AlertDescription>
    </Alert>
  )
}
