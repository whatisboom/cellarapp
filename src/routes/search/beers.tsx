import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button, Card, EmptyState, Input, Spinner, useToast } from '@whatisboom/boom-ui'
import { searchBeers } from '~/server/functions/search'
import type { UntappdBeerResult } from '~/server/auth'

export const Route = createFileRoute('/search/beers')({
  component: SearchBeers,
})

function SearchBeers() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UntappdBeerResult[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const data = await searchBeers({ data: { query: query.trim() } })
      setResults(data)
    } catch (err) {
      toast({ message: err instanceof Error ? err.message : 'Search failed', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search Beers</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Untappd for beers..."
          className="max-w-md"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : <Search className="mr-2 h-4 w-4" />}
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((beer) => (
          <Card key={beer.untappdId} padding={6} hoverable>
            <h3 className="text-lg font-semibold">{beer.name}</h3>
            <div className="mt-2 text-sm space-y-1" style={{ color: 'var(--boom-theme-text-secondary)' }}>
              <p className="font-medium" style={{ color: 'var(--boom-theme-text-primary)' }}>{beer.brewery.name}</p>
              <p>{beer.style}</p>
              {beer.abv > 0 && <p>{beer.abv}% ABV</p>}
              <p className="text-xs">
                {[beer.brewery.city, beer.brewery.state, beer.brewery.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && query && !loading && (
        <EmptyState title="No results found" description="Try a different search term." />
      )}
    </div>
  )
}
