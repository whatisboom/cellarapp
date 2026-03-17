import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)

vi.mock('~/server/functions/search', () => ({
  searchBeers: vi.fn(),
}))

vi.mock('~/server/functions/inventory', () => ({
  addBeerFromUntappd: vi.fn(),
}))

const mockToast = vi.fn()
vi.mock('@whatisboom/boom-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@whatisboom/boom-ui')>()
  return {
    ...actual,
    useToast: () => ({ toast: mockToast, dismiss: vi.fn(), dismissAll: vi.fn(), toasts: [] }),
  }
})

const routeModule = await import('./beers')
const Route = asMockRoute(routeModule.Route)
const Component = Route.component

describe('Search beers page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Route.__setLoaderData({ results: [], query: '' })
    Route.__setSearchData({ q: undefined })
  })

  it('renders search form', () => {
    render(<Component />)
    expect(screen.getByPlaceholderText('Search Untappd for beers...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Search/ })).toBeInTheDocument()
  })

  it('shows results from loader data', () => {
    Route.__setLoaderData({
      results: [
        {
          untappdId: 1,
          name: 'Heady Topper',
          slug: 'heady-topper',
          style: 'DIPA',
          abv: 8.0,
          description: 'A great beer',
          labelUrl: '',
          brewery: { name: 'The Alchemist', slug: 'alchemist', untappdId: 100, city: 'Stowe', state: 'VT', country: 'US' },
        },
      ],
      query: 'heady',
    })
    render(<Component />)
    expect(screen.getByText('Heady Topper')).toBeInTheDocument()
    expect(screen.getByText('The Alchemist')).toBeInTheDocument()
  })

  it('shows empty state when no results', () => {
    Route.__setLoaderData({ results: [], query: 'nonexistent' })
    render(<Component />)
    expect(screen.getByText(/No results found/)).toBeInTheDocument()
  })

  it('shows Add to Cellar button on each result', () => {
    Route.__setLoaderData({
      results: [
        {
          untappdId: 1,
          name: 'Heady Topper',
          slug: 'heady-topper',
          style: 'DIPA',
          abv: 8.0,
          description: '',
          labelUrl: '',
          brewery: { name: 'The Alchemist', slug: 'alchemist', untappdId: 100, city: 'Stowe', state: 'VT', country: 'US' },
        },
      ],
      query: 'heady',
    })
    render(<Component />)
    expect(screen.getByRole('button', { name: /Add to Cellar/ })).toBeInTheDocument()
  })

  it('expands add form when clicking Add to Cellar', async () => {
    Route.__setLoaderData({
      results: [
        {
          untappdId: 1,
          name: 'Heady Topper',
          slug: 'heady-topper',
          style: 'DIPA',
          abv: 8.0,
          description: '',
          labelUrl: '',
          brewery: { name: 'The Alchemist', slug: 'alchemist', untappdId: 100, city: 'Stowe', state: 'VT', country: 'US' },
        },
      ],
      query: 'heady',
    })
    const user = userEvent.setup()
    render(<Component />)
    await user.click(screen.getByRole('button', { name: /Add to Cellar/ }))

    await waitFor(() => {
      expect(screen.getByText('Quantity')).toBeInTheDocument()
      expect(screen.getByText('For Trade')).toBeInTheDocument()
    })
  })
})
