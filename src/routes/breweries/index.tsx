import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
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
          <Card key={brewery.id}>
            <CardHeader>
              <Link to="/breweries/$slug" params={{ slug: brewery.slug }}>
                <CardTitle className="hover:underline">{brewery.name}</CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{[brewery.city, brewery.state, brewery.country].filter(Boolean).join(', ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link to="/breweries" search={{ page: page - 1 }}>Previous</Link>
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link to="/breweries" search={{ page: page + 1 }}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
