import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'
import { useThemeStore } from '~/lib/stores/theme'

vi.mock('@tanstack/react-router', () => createRouterMock())
vi.mock('~/server/functions/auth', () => ({ getMe: vi.fn() }))

const routeModule = await import('./settings')
const Component = asMockRoute(routeModule.Route).component

describe('Settings page', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'light' })
  })

  it('renders "Dark mode" button when theme is light', () => {
    render(<Component />)
    expect(screen.getByRole('button', { name: /Dark mode/i })).toBeInTheDocument()
  })

  it('toggles theme on click', async () => {
    const user = userEvent.setup()
    render(<Component />)
    await user.click(screen.getByRole('button', { name: /Dark mode/i }))
    expect(useThemeStore.getState().mode).toBe('dark')
  })
})
