import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)
vi.mock('~/server/functions/breweries', () => ({ getBrewery: vi.fn() }))

const routeModule = await import('./$slug')
const Route = asMockRoute(routeModule.Route)

describe('Brewery details page', () => {
  it('renders brewery name and location', () => {
    Route.__setLoaderData({
      name: 'The Alchemist',
      city: 'Stowe',
      state: 'VT',
      country: 'US',
      beers: [],
    })
    render(<Route.component />)
    expect(screen.getByText('The Alchemist')).toBeInTheDocument()
    expect(screen.getByText('Stowe, VT, US')).toBeInTheDocument()
  })

  it('renders beers table when beers exist', () => {
    Route.__setLoaderData({
      name: 'The Alchemist',
      city: 'Stowe',
      state: 'VT',
      country: 'US',
      beers: [
        { id: '1', name: 'Heady Topper', slug: 'heady', style: 'DIPA', abv: '8.0' },
        { id: '2', name: 'Focal Banger', slug: 'focal', style: 'IPA', abv: '7.0' },
      ],
    })
    render(<Route.component />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Beers (2)')).toBeInTheDocument()
  })

  it('shows empty state when no beers', () => {
    Route.__setLoaderData({
      name: 'Test Brewery',
      city: null,
      state: null,
      country: null,
      beers: [],
    })
    render(<Route.component />)
    expect(screen.getByText('No beers listed yet')).toBeInTheDocument()
  })
})
