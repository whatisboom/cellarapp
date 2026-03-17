import { Link } from '@tanstack/react-router'
import { Alert, Button } from '@whatisboom/boom-ui'

export function RouteError({ error }: { error: Error }) {
  const is404 = error.message.includes('not found')

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <Alert variant={is404 ? 'warning' : 'error'} className="max-w-md">
        <strong>{is404 ? 'Not Found' : 'Something went wrong'}</strong>
        <p>{error.message}</p>
      </Alert>
      <Link to="/">
        <Button variant="secondary">Go Home</Button>
      </Link>
    </div>
  )
}
