import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { listBeers } from '~/server/functions/beers'

export const Route = createFileRoute('/beers/')({
  validateSearch: (search) => z.object({ page: z.number().int().min(1).catch(1) }).parse(search),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps }) => listBeers({ data: { page: deps.page, limit: 20 } }),
  component: BeersList,
})

function BeersList() {
  const { beers, page, totalPages } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Beers</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beers.map((beer) => (
          <Card key={beer.id}>
            <CardHeader>
              <Link to="/beers/$slug" params={{ slug: beer.slug }}>
                <CardTitle className="hover:underline">{beer.name}</CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {beer.breweryName && <p>{beer.breweryName}</p>}
              {beer.style && <p>{beer.style}</p>}
              {beer.abv && <p>{beer.abv}% ABV</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link to="/beers" search={{ page: page - 1 }}>Previous</Link>
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link to="/beers" search={{ page: page + 1 }}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
