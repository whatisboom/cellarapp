import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)
vi.mock('~/server/functions/auth', () => ({ getMe: vi.fn() }))

const mockUpdateInventory = vi.fn()
const mockRemoveFromInventory = vi.fn()
vi.mock('~/server/functions/inventory', () => ({
  getUserInventory: vi.fn(),
  updateInventory: mockUpdateInventory,
  removeFromInventory: mockRemoveFromInventory,
}))

const mockToast = vi.fn()
vi.mock('@whatisboom/boom-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@whatisboom/boom-ui')>()
  return {
    ...actual,
    useToast: () => ({ toast: mockToast, dismiss: vi.fn(), dismissAll: vi.fn(), toasts: [] }),
  }
})

const routeModule = await import('./dashboard')
const Route = asMockRoute(routeModule.Route)

const mockUser = {
  id: 'u1',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  avatarUrl: null,
}

const mockInventory = [
  {
    id: 'inv-1',
    amount: 3,
    forTrade: 1,
    beer: { id: 'b1', name: 'Heady Topper', slug: 'heady', style: 'DIPA', abv: '8.0' },
    brewery: { name: 'The Alchemist', slug: 'alchemist' },
  },
]

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Route.__setLoaderData({ user: mockUser, inventory: mockInventory })
  })

  it('renders user info and beer count', () => {
    render(<Route.component />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText(/1 beers in cellar/)).toBeInTheDocument()
  })

  it('renders My Cellar heading', () => {
    render(<Route.component />)
    expect(screen.getByText('My Cellar')).toBeInTheDocument()
  })

  it('renders inventory table', () => {
    render(<Route.component />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders empty state when no inventory', () => {
    Route.__setLoaderData({ user: mockUser, inventory: [] })
    render(<Route.component />)
    expect(screen.getByText('No beers in cellar yet')).toBeInTheDocument()
  })
})
