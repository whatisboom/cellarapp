import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)
vi.mock('~/server/functions/beers', () => ({ getBeer: vi.fn() }))

const routeModule = await import('./$slug')
const Route = asMockRoute(routeModule.Route)

describe('Beer details page', () => {
  it('renders beer details with brewery link', () => {
    Route.__setLoaderData({
      name: 'Heady Topper',
      style: 'DIPA',
      abv: '8.0',
      ibu: '75',
      description: 'A world-class DIPA.',
      brewery: { name: 'The Alchemist', slug: 'the-alchemist', city: 'Stowe', state: 'VT', country: 'US' },
    })
    render(<Route.component />)
    expect(screen.getByText('Heady Topper')).toBeInTheDocument()
    expect(screen.getByText('DIPA')).toBeInTheDocument()
    expect(screen.getByText('8.0% ABV')).toBeInTheDocument()
    expect(screen.getByText('75 IBU')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'The Alchemist' })).toHaveAttribute('href', '/breweries/the-alchemist')
  })

  it('renders description when present', () => {
    Route.__setLoaderData({
      name: 'Test',
      style: null,
      abv: null,
      ibu: null,
      description: 'A tasty beer.',
      brewery: null,
    })
    render(<Route.component />)
    expect(screen.getByText('A tasty beer.')).toBeInTheDocument()
  })

  it('hides optional fields when null', () => {
    Route.__setLoaderData({
      name: 'Test',
      style: null,
      abv: null,
      ibu: null,
      description: null,
      brewery: null,
    })
    render(<Route.component />)
    expect(screen.queryByText(/ABV/)).not.toBeInTheDocument()
    expect(screen.queryByText(/IBU/)).not.toBeInTheDocument()
    expect(screen.queryByText('Description')).not.toBeInTheDocument()
  })
})
