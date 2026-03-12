import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { getBeer } from '~/server/functions/beers'

export const Route = createFileRoute('/beers/$slug')({
  loader: async ({ params }) => getBeer({ data: { slug: params.slug } }),
  component: BeerDetails,
})

function BeerDetails() {
  const beer = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{beer.name}</h1>
        {beer.brewery && (
          <Link to="/breweries/$slug" params={{ slug: beer.brewery.slug }} className="text-muted-foreground hover:underline">
            {beer.brewery.name}
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-6">
          {beer.style && <Badge variant="secondary">{beer.style}</Badge>}
          {beer.abv && <Badge variant="outline">{beer.abv}% ABV</Badge>}
          {beer.ibu && <Badge variant="outline">{beer.ibu} IBU</Badge>}
        </CardContent>
      </Card>

      {beer.description && (
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent><p>{beer.description}</p></CardContent>
        </Card>
      )}

      {beer.brewery && (
        <Card>
          <CardHeader><CardTitle>Brewery</CardTitle></CardHeader>
          <CardContent>
            <p className="font-medium">{beer.brewery.name}</p>
            <p className="text-sm text-muted-foreground">
              {[beer.brewery.city, beer.brewery.state, beer.brewery.country].filter(Boolean).join(', ')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
