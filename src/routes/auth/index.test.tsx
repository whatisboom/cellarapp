import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

vi.mock('@tanstack/react-router', () => createRouterMock())

const routeModule = await import('./index')
const Component = asMockRoute(routeModule.Route).component

describe('Auth page', () => {
  it('renders sign-in heading', () => {
    render(<Component />)
    expect(screen.getByText('Sign in to Beer Cellar')).toBeInTheDocument()
  })

  it('renders Untappd OAuth link', () => {
    render(<Component />)
    const link = screen.getByRole('link', { name: /Sign in with Untappd/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('untappd.com/oauth'))
  })
})
