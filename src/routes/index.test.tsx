import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

vi.mock('@tanstack/react-router', () => createRouterMock())

const routeModule = await import('./index')
const Component = asMockRoute(routeModule.Route).component

describe('Home page', () => {
  it('renders heading and Get Started button', () => {
    render(<Component />)
    expect(screen.getByText('Beer Cellar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Get Started/i })).toHaveAttribute('href', '/auth')
  })

  it('renders all three feature cards', () => {
    render(<Component />)
    expect(screen.getByText('Track Your Cellar')).toBeInTheDocument()
    expect(screen.getByText('Trade with Others')).toBeInTheDocument()
    expect(screen.getByText('Discover Beers')).toBeInTheDocument()
  })
})
