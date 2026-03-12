import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { searchBeers } from '~/server/functions/search'
import { toast } from 'sonner'
import type { UntappdBeerResult } from '~/server/auth'

export const Route = createFileRoute('/search/beers')({
  component: SearchBeers,
})

function SearchBeers() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UntappdBeerResult[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const data = await searchBeers({ data: { query: query.trim() } })
      setResults(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Search failed')
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
          <Search className="mr-2 h-4 w-4" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((beer) => (
          <Card key={beer.untappdId}>
            <CardHeader>
              <CardTitle className="text-lg">{beer.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{beer.brewery.name}</p>
              <p>{beer.style}</p>
              {beer.abv > 0 && <p>{beer.abv}% ABV</p>}
              <p className="text-xs">
                {[beer.brewery.city, beer.brewery.state, beer.brewery.country].filter(Boolean).join(', ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && query && !loading && (
        <p className="text-center text-muted-foreground">No results found. Try a different search term.</p>
      )}
    </div>
  )
}
