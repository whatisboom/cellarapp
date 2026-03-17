import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

vi.mock('@tanstack/react-router', () => createRouterMock())

const mockSearchBeers = vi.fn()
vi.mock('~/server/functions/search', () => ({
  searchBeers: mockSearchBeers,
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
const Component = asMockRoute(routeModule.Route).component

describe('Search beers page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search form', () => {
    render(<Component />)
    expect(screen.getByPlaceholderText('Search Untappd for beers...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Search/ })).toBeInTheDocument()
  })

  it('shows results after search', async () => {
    mockSearchBeers.mockResolvedValueOnce([
      {
        untappdId: 1,
        name: 'Heady Topper',
        style: 'DIPA',
        abv: 8.0,
        brewery: { name: 'The Alchemist', city: 'Stowe', state: 'VT', country: 'US' },
      },
    ])
    const user = userEvent.setup()
    render(<Component />)

    await user.type(screen.getByPlaceholderText('Search Untappd for beers...'), 'heady')
    await user.click(screen.getByRole('button', { name: /Search/ }))

    await waitFor(() => {
      expect(screen.getByText('Heady Topper')).toBeInTheDocument()
      expect(screen.getByText('The Alchemist')).toBeInTheDocument()
    })
  })

  it('shows "No results" when empty', async () => {
    mockSearchBeers.mockResolvedValueOnce([])
    const user = userEvent.setup()
    render(<Component />)

    await user.type(screen.getByPlaceholderText('Search Untappd for beers...'), 'nonexistent')
    await user.click(screen.getByRole('button', { name: /Search/ }))

    await waitFor(() => {
      expect(screen.getByText(/No results found/)).toBeInTheDocument()
    })
  })

  it('shows error toast on failure', async () => {
    mockSearchBeers.mockRejectedValueOnce(new Error('API error'))
    const user = userEvent.setup()
    render(<Component />)

    await user.type(screen.getByPlaceholderText('Search Untappd for beers...'), 'test')
    await user.click(screen.getByRole('button', { name: /Search/ }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({ message: 'API error', variant: 'error' })
    })
  })
})
