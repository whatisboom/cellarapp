import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)
vi.mock('~/server/functions/users', () => ({ getUser: vi.fn() }))
vi.mock('~/server/functions/inventory', () => ({ getUserInventory: vi.fn() }))

const routeModule = await import('./$username')
const Route = asMockRoute(routeModule.Route)

describe('User profile page', () => {
  it('renders user profile', () => {
    Route.__setLoaderData({
      user: { username: 'alice', firstName: 'Alice', lastName: 'Smith', avatarUrl: null, location: 'NYC' },
      inventory: [],
    })
    render(<Route.component />)
    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText(/Alice Smith/)).toBeInTheDocument()
    expect(screen.getByText(/NYC/)).toBeInTheDocument()
  })

  it('renders inventory as non-owner', () => {
    Route.__setLoaderData({
      user: { username: 'alice', firstName: 'Alice', lastName: 'Smith', avatarUrl: null, location: null },
      inventory: [
        {
          id: 'inv-1',
          amount: 2,
          forTrade: 0,
          beer: { id: 'b1', name: 'Test Beer', slug: 'test-beer', style: null, abv: null },
          brewery: { name: 'Test Brewery', slug: 'test-brewery' },
        },
      ],
    })
    render(<Route.component />)
    expect(screen.getByText('Test Beer')).toBeInTheDocument()
    // Actions column should not be present since isOwner=false
    expect(screen.queryByText('Actions')).not.toBeInTheDocument()
  })
})
