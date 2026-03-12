import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { getBrewery } from '~/server/functions/breweries'

export const Route = createFileRoute('/breweries/$slug')({
  loader: async ({ params }) => getBrewery({ data: { slug: params.slug } }),
  component: BreweryDetails,
})

function BreweryDetails() {
  const brewery = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{brewery.name}</h1>
        <p className="text-muted-foreground">
          {[brewery.city, brewery.state, brewery.country].filter(Boolean).join(', ')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beers ({brewery.beers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {brewery.beers.length === 0 ? (
            <p className="text-muted-foreground">No beers listed yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Style</TableHead>
                  <TableHead>ABV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brewery.beers.map((beer) => (
                  <TableRow key={beer.id}>
                    <TableCell>
                      <Link to="/beers/$slug" params={{ slug: beer.slug }} className="font-medium hover:underline">
                        {beer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{beer.style ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{beer.abv ? `${beer.abv}%` : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
