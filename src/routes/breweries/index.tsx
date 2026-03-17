import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Button, Card } from '@whatisboom/boom-ui'
import { listBreweries } from '~/server/functions/breweries'

export const Route = createFileRoute('/breweries/')({
  validateSearch: (search) => z.object({ page: z.number().int().min(1).catch(1) }).parse(search),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps }) => listBreweries({ data: { page: deps.page, limit: 20 } }),
  component: BreweriesList,
})

function BreweriesList() {
  const { breweries, page, totalPages } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Breweries</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {breweries.map((brewery) => (
          <Card key={brewery.id} padding={6} hoverable>
            <Link to="/breweries/$slug" params={{ slug: brewery.slug }}>
              <h3 className="font-semibold hover:underline">{brewery.name}</h3>
            </Link>
            <p className="mt-1 text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
              {[brewery.city, brewery.state, brewery.country].filter(Boolean).join(', ')}
            </p>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Link to="/breweries" search={{ page: page - 1 }}>
            <Button variant="secondary" size="sm" disabled={page <= 1}>Previous</Button>
          </Link>
          <span className="flex items-center text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          <Link to="/breweries" search={{ page: page + 1 }}>
            <Button variant="secondary" size="sm" disabled={page >= totalPages}>Next</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
