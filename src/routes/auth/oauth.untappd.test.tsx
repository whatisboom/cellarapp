import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const routerMock = createRouterMock()
vi.mock('@tanstack/react-router', () => routerMock)

const mockLoginWithUntappd = vi.fn()
vi.mock('~/server/functions/auth', () => ({
  loginWithUntappd: mockLoginWithUntappd,
}))

const routeModule = await import('./oauth.untappd')
const Route = asMockRoute(routeModule.Route)

describe('OAuth callback page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "Authenticating..." when code is present', () => {
    Route.__setSearchData({ code: 'abc123' })
    mockLoginWithUntappd.mockReturnValue(new Promise(() => {})) // never resolves
    render(<Route.component />)
    expect(screen.getByText('Authenticating with Untappd...')).toBeInTheDocument()
  })

  it('shows error when no code', async () => {
    Route.__setSearchData({ code: undefined })
    render(<Route.component />)
    await waitFor(() => {
      expect(screen.getByText('Authentication Error')).toBeInTheDocument()
      expect(screen.getByText('No authorization code received from Untappd.')).toBeInTheDocument()
    })
  })

  it('shows error when loginWithUntappd fails', async () => {
    Route.__setSearchData({ code: 'abc123' })
    mockLoginWithUntappd.mockRejectedValueOnce(new Error('Invalid code'))
    render(<Route.component />)
    await waitFor(() => {
      expect(screen.getByText('Authentication Error')).toBeInTheDocument()
      expect(screen.getByText('Invalid code')).toBeInTheDocument()
    })
  })
})
