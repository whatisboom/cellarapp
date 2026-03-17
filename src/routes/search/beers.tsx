import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { Search, Plus, Check } from 'lucide-react'
import { Button, Card, EmptyState, Input, Slider, Spinner, Badge, useToast } from '@whatisboom/boom-ui'
import { searchBeers } from '~/server/functions/search'
import { addBeerFromUntappd } from '~/server/functions/inventory'
import type { UntappdBeerResult } from '~/server/auth'

export const Route = createFileRoute('/search/beers')({
  validateSearch: (search) =>
    z.object({ q: z.string().optional() }).parse(search),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    if (!deps.q) return { results: [], query: '' }
    const results = await searchBeers({ data: { query: deps.q } })
    return { results, query: deps.q }
  },
  component: SearchBeers,
})

function SearchBeers() {
  const { results, query } = Route.useLoaderData()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState(query)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim()) return
    navigate({ to: '/search/beers', search: { q: inputValue.trim() } })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search Beers</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search Untappd for beers..."
          className="max-w-md"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((beer) => (
          <SearchResultCard key={beer.untappdId} beer={beer} />
        ))}
      </div>

      {results.length === 0 && query && (
        <EmptyState title="No results found" description="Try a different search term." />
      )}
    </div>
  )
}

function SearchResultCard({ beer }: { beer: UntappdBeerResult }) {
  const [expanded, setExpanded] = useState(false)
  const [amount, setAmount] = useState(1)
  const [forTrade, setForTrade] = useState(0)
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const { toast } = useToast()

  async function handleAdd() {
    setAdding(true)
    try {
      await addBeerFromUntappd({ data: { beer, amount, forTrade } })
      toast({ message: `${beer.name} added to cellar!`, variant: 'success' })
      setAdded(true)
      setExpanded(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add'
      if (message === 'Beer already in cellar') {
        setAdded(true)
        setExpanded(false)
      }
      toast({ message, variant: 'error' })
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card padding={6} hoverable>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{beer.name}</h3>
          <p className="text-sm font-medium">{beer.brewery.name}</p>
        </div>
        {beer.labelUrl && (
          <img
            src={beer.labelUrl}
            alt={`${beer.name} label`}
            className="h-16 w-16 rounded object-cover"
          />
        )}
      </div>
      <div className="mt-2 text-sm space-y-1" style={{ color: 'var(--boom-theme-text-secondary)' }}>
        <p>{beer.style}</p>
        {beer.abv > 0 && <p>{beer.abv}% ABV</p>}
        <p className="text-xs">
          {[beer.brewery.city, beer.brewery.state, beer.brewery.country].filter(Boolean).join(', ')}
        </p>
      </div>

      <div className="mt-3">
        {added ? (
          <Badge variant="success"><Check className="mr-1 h-3 w-3" /> In Cellar</Badge>
        ) : expanded ? (
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--boom-theme-border-default)' }}>
            <Slider
              label="Quantity"
              value={amount}
              onChange={setAmount}
              min={1}
              max={100}
              step={1}
              size="sm"
            />
            <Slider
              label="For Trade"
              value={forTrade}
              onChange={(v) => setForTrade(Math.min(v, amount))}
              min={0}
              max={amount}
              step={1}
              size="sm"
            />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAdd} disabled={adding}>
                {adding ? <Spinner size="sm" /> : <Plus className="mr-1 h-3 w-3" />}
                Add to Cellar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setExpanded(true)}>
            <Plus className="mr-1 h-3 w-3" /> Add to Cellar
          </Button>
        )}
      </div>
    </Card>
  )
}
