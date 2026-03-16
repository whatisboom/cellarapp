import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

const mockToast = { success: vi.fn(), error: vi.fn() }
vi.mock('sonner', () => ({ toast: mockToast }))

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

  it('renders inventory list', () => {
    render(<Route.component />)
    expect(screen.getByText('Heady Topper')).toBeInTheDocument()
  })

  it('handleUpdate shows success toast', async () => {
    mockUpdateInventory.mockResolvedValueOnce({})
    render(<Route.component />)

    // Click edit button, then save
    const buttons = screen.getAllByRole('button')
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    await user.click(buttons[0]!) // edit
    await user.click(screen.getAllByRole('button')[0]!) // save

    await waitFor(() => {
      expect(mockUpdateInventory).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith('Inventory updated')
    })
  })

  it('handleUpdate shows error toast on failure', async () => {
    mockUpdateInventory.mockRejectedValueOnce(new Error('Update failed'))
    render(<Route.component />)

    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button')[0]!) // edit
    await user.click(screen.getAllByRole('button')[0]!) // save

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Update failed')
    })
  })
})
