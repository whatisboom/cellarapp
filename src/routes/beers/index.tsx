import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Card } from '@whatisboom/boom-ui'
import { listBeers } from '~/server/functions/beers'
import { Pagination } from '~/components/pagination'

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
          <Card key={beer.id} padding={6} hoverable>
            <Link to="/beers/$slug" params={{ slug: beer.slug }}>
              <h3 className="font-semibold hover:underline">{beer.name}</h3>
            </Link>
            <div className="mt-2 text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
              {beer.breweryName && <p>{beer.breweryName}</p>}
              {beer.style && <p>{beer.style}</p>}
              {beer.abv && <p>{beer.abv}% ABV</p>}
            </div>
          </Card>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} to="/beers" />
    </div>
  )
}
