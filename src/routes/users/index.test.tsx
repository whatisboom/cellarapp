import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)
vi.mock('~/server/functions/users', () => ({ listUsers: vi.fn() }))

const routeModule = await import('./index')
const Route = asMockRoute(routeModule.Route)

describe('Users list page', () => {
  it('renders user cards', () => {
    Route.__setLoaderData({
      users: [
        { id: '1', username: 'alice', avatarUrl: null },
        { id: '2', username: 'bob', avatarUrl: 'https://example.com/bob.jpg' },
      ],
      page: 1,
      totalPages: 1,
    })
    Route.__setSearchData({ search: undefined })
    render(<Route.component />)
    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText('bob')).toBeInTheDocument()
  })

  it('renders search input', () => {
    Route.__setLoaderData({ users: [], page: 1, totalPages: 1 })
    Route.__setSearchData({ search: undefined })
    render(<Route.component />)
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
  })

  it('shows pagination', () => {
    Route.__setLoaderData({
      users: [{ id: '1', username: 'alice', avatarUrl: null }],
      page: 1,
      totalPages: 3,
    })
    Route.__setSearchData({ search: undefined })
    render(<Route.component />)
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })
})
