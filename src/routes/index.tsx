import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Beer Cellar</h1>
      <p className="text-muted-foreground">Your beer inventory and trading platform.</p>
      <Button>Get Started</Button>
    </div>
  )
}
