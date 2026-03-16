import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRouterMock } from '~/tests/render-helpers'

vi.mock('@tanstack/react-router', () => createRouterMock())
vi.mock('~/server/functions/auth', () => ({ logout: vi.fn() }))

const { SiteHeader } = await import('./site-header')

const mockUser = { username: 'testuser', avatarUrl: null }

describe('SiteHeader', () => {
  it('renders brand link', () => {
    render(<SiteHeader user={null} />)
    const brand = screen.getByRole('link', { name: /Beer Cellar/i })
    expect(brand).toHaveAttribute('href', '/')
  })

  it('shows Sign In when user is null', () => {
    render(<SiteHeader user={null} />)
    expect(screen.getByRole('link', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('shows nav links when user is provided', () => {
    render(<SiteHeader user={mockUser} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Beers')).toBeInTheDocument()
    expect(screen.getByText('Breweries')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows mobile menu toggle when user is provided', () => {
    render(<SiteHeader user={mockUser} />)
    // The menu toggle button has the Menu icon
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })
})
