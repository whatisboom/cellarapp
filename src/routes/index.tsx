import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div>
      <h1>Beer Cellar</h1>
      <p>Your beer inventory and trading platform.</p>
    </div>
  )
}
