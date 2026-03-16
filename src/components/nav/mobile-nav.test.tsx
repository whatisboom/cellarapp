import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRouterMock } from '~/tests/render-helpers'
import { useNavStore } from '~/lib/stores/nav'

vi.mock('@tanstack/react-router', () => createRouterMock())

const { MobileNav } = await import('./mobile-nav')

describe('MobileNav', () => {
  beforeEach(() => {
    useNavStore.setState({ open: true })
  })

  it('renders nav links when open', () => {
    render(<MobileNav />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Beers')).toBeInTheDocument()
    expect(screen.getByText('Breweries')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('calls close on link click', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    await user.click(screen.getByText('Dashboard'))
    expect(useNavStore.getState().open).toBe(false)
  })
})
