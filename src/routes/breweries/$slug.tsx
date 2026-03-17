import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, EmptyState, Table } from '@whatisboom/boom-ui'
import type { ColumnDef } from '@whatisboom/boom-ui'
import { getBrewery } from '~/server/functions/breweries'
import { RouteError } from '~/components/route-error'

interface BreweryBeer {
  id: string
  name: string
  slug: string
  style: string | null
  abv: string | null
}

export const Route = createFileRoute('/breweries/$slug')({
  loader: async ({ params }) => getBrewery({ data: { slug: params.slug } }),
  component: BreweryDetails,
  errorComponent: ({ error }) => <RouteError error={error} />,
})

const beerColumns: ColumnDef<BreweryBeer>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link to="/beers/$slug" params={{ slug: row.slug }} className="font-medium hover:underline">
        {row.name}
      </Link>
    ),
  },
  {
    id: 'style',
    header: 'Style',
    accessorKey: 'style',
    cell: ({ value }) => (value as string) ?? '—',
  },
  {
    id: 'abv',
    header: 'ABV',
    cell: ({ row }) => (row.abv ? `${row.abv}%` : '—'),
  },
]

function BreweryDetails() {
  const brewery = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{brewery.name}</h1>
        <p style={{ color: 'var(--boom-theme-text-secondary)' }}>
          {[brewery.city, brewery.state, brewery.country].filter(Boolean).join(', ')}
        </p>
      </div>

      <Card padding={6}>
        <h2 className="text-lg font-semibold mb-4">Beers ({brewery.beers.length})</h2>
        {brewery.beers.length === 0 ? (
          <EmptyState title="No beers listed yet" />
        ) : (
          <Table<BreweryBeer>
            columns={beerColumns}
            data={brewery.beers}
            getRowId={(row) => row.id}
            hoverable
          />
        )}
      </Card>
    </div>
  )
}
