import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)
vi.mock('~/server/functions/breweries', () => ({ listBreweries: vi.fn() }))

const routeModule = await import('./index')
const Route = asMockRoute(routeModule.Route)

describe('Breweries list page', () => {
  it('renders brewery cards with location', () => {
    Route.__setLoaderData({
      breweries: [
        { id: '1', name: 'The Alchemist', slug: 'the-alchemist', city: 'Stowe', state: 'VT', country: 'US' },
        { id: '2', name: 'Russian River', slug: 'russian-river', city: 'Santa Rosa', state: 'CA', country: 'US' },
      ],
      page: 1,
      totalPages: 1,
    })
    render(<Route.component />)
    expect(screen.getByText('The Alchemist')).toBeInTheDocument()
    expect(screen.getByText('Russian River')).toBeInTheDocument()
    expect(screen.getByText('Stowe, VT, US')).toBeInTheDocument()
  })

  it('shows/hides pagination', () => {
    Route.__setLoaderData({
      breweries: [{ id: '1', name: 'Test', slug: 'test', city: 'NYC', state: 'NY', country: 'US' }],
      page: 2,
      totalPages: 5,
    })
    render(<Route.component />)
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
  })
})
