import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge, Card } from '@whatisboom/boom-ui'
import { getBeer } from '~/server/functions/beers'
import { RouteError } from '~/components/route-error'

export const Route = createFileRoute('/beers/$slug')({
  loader: async ({ params }) => getBeer({ data: { slug: params.slug } }),
  component: BeerDetails,
  errorComponent: ({ error }) => <RouteError error={error} />,
})

function BeerDetails() {
  const beer = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{beer.name}</h1>
        {beer.brewery && (
          <Link to="/breweries/$slug" params={{ slug: beer.brewery.slug }} className="hover:underline" style={{ color: 'var(--boom-theme-text-secondary)' }}>
            {beer.brewery.name}
          </Link>
        )}
      </div>

      <Card padding={6}>
        <div className="flex flex-wrap gap-3">
          {beer.style && <Badge variant="info">{beer.style}</Badge>}
          {beer.abv && <Badge variant="neutral">{beer.abv}% ABV</Badge>}
          {beer.ibu && <Badge variant="neutral">{beer.ibu} IBU</Badge>}
        </div>
      </Card>

      {beer.description && (
        <Card padding={6}>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p>{beer.description}</p>
        </Card>
      )}

      {beer.brewery && (
        <Card padding={6}>
          <h2 className="text-lg font-semibold mb-2">Brewery</h2>
          <p className="font-medium">{beer.brewery.name}</p>
          <p className="text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
            {[beer.brewery.city, beer.brewery.state, beer.brewery.country].filter(Boolean).join(', ')}
          </p>
        </Card>
      )}
    </div>
  )
}
