import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)
vi.mock('~/server/functions/beers', () => ({ listBeers: vi.fn() }))

const routeModule = await import('./index')
const Route = asMockRoute(routeModule.Route)

describe('Beers list page', () => {
  it('renders beer cards from loader data', () => {
    Route.__setLoaderData({
      beers: [
        { id: '1', name: 'Heady Topper', slug: 'heady', breweryName: 'The Alchemist', style: 'DIPA', abv: '8.0' },
        { id: '2', name: 'Pliny', slug: 'pliny', breweryName: 'Russian River', style: 'IPA', abv: '8.0' },
      ],
      page: 1,
      totalPages: 1,
    })
    render(<Route.component />)
    expect(screen.getByText('Heady Topper')).toBeInTheDocument()
    expect(screen.getByText('Pliny')).toBeInTheDocument()
    expect(screen.getByText('DIPA')).toBeInTheDocument()
  })

  it('shows pagination when totalPages > 1', () => {
    Route.__setLoaderData({
      beers: [{ id: '1', name: 'Beer', slug: 'beer', breweryName: null, style: null, abv: null }],
      page: 1,
      totalPages: 3,
    })
    render(<Route.component />)
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('hides pagination when single page', () => {
    Route.__setLoaderData({
      beers: [{ id: '1', name: 'Beer', slug: 'beer', breweryName: null, style: null, abv: null }],
      page: 1,
      totalPages: 1,
    })
    render(<Route.component />)
    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
  })
})
